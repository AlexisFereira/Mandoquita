import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

const OBSERVER_THRESHOLD = 0.15;
const MAX_OBSERVED_ELEMENTS = 50;
const MOTION_DURATION_MS = 220;

type MotionState = "final" | "prepared" | "entering";
type ApprovedMotionElement = "div" | "section" | "article" | "aside";

type ObservationCallback = () => void;
const observedElements = new Map<Element, ObservationCallback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") {
    return sharedObserver;
  }

  sharedObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting && entry.intersectionRatio < OBSERVER_THRESHOLD) continue;
      const reveal = observedElements.get(entry.target);
      if (!reveal) continue;
      sharedObserver?.unobserve(entry.target);
      observedElements.delete(entry.target);
      reveal();
    }
  }, { threshold: OBSERVER_THRESHOLD });

  return sharedObserver;
}

function observeForEntry(
  element: Element,
  reveal: ObservationCallback,
  fallback: ObservationCallback,
) {
  const observer = getSharedObserver();
  if (!observer || observedElements.size >= MAX_OBSERVED_ELEMENTS) {
    fallback();
    return () => undefined;
  }

  observedElements.set(element, reveal);
  try {
    observer.observe(element);
  } catch {
    observedElements.delete(element);
    fallback();
  }

  return () => {
    observer.unobserve(element);
    observedElements.delete(element);
    if (observedElements.size === 0) {
      observer.disconnect();
      sharedObserver = null;
    }
  };
}

export type ScrollEntryMotionProps = PropsWithChildren<{
  as?: ApprovedMotionElement;
  distance?: "none" | "sm";
  delayStep?: 0 | 40;
  className?: string;
}>;

export function ScrollEntryMotion({
  as: Component = "div",
  distance = "sm",
  delayStep = 0,
  className = "",
  children,
}: ScrollEntryMotionProps) {
  const elementRef = useRef<HTMLElement>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [motionState, setMotionState] = useState<MotionState>("final");
  const revealed = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || revealed.current) return;

    if (typeof window.matchMedia !== "function") {
      revealed.current = true;
      setMotionState("final");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = window.location.hash
      ? document.querySelector(window.location.hash)
      : null;
    const isTargeted = Boolean(target && element.contains(target));
    const containsFocus = element.contains(document.activeElement);
    const belowInitialViewport = element.getBoundingClientRect().top >= window.innerHeight;

    if (reducedMotion.matches || isTargeted || containsFocus || !belowInitialViewport) {
      revealed.current = true;
      setMotionState("final");
      return;
    }

    setMotionState("prepared");

    let stopObserving: () => void = () => undefined;
    const revealImmediately = () => {
      stopObserving();
      revealed.current = true;
      setMotionState("final");
    };
    const revealWithMotion = () => {
      if (revealed.current) return;
      revealed.current = true;
      setMotionState("entering");
      completionTimer.current = setTimeout(
        () => setMotionState("final"),
        MOTION_DURATION_MS + delayStep + 40,
      );
    };
    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) revealImmediately();
    };
    const handleFocus = () => revealImmediately();
    const handleHashChange = () => {
      const hashTarget = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      if (hashTarget && element.contains(hashTarget)) revealImmediately();
    };

    reducedMotion.addEventListener("change", handlePreferenceChange);
    element.addEventListener("focusin", handleFocus);
    window.addEventListener("hashchange", handleHashChange);
    stopObserving = observeForEntry(element, revealWithMotion, revealImmediately);

    return () => {
      stopObserving();
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      element.removeEventListener("focusin", handleFocus);
      window.removeEventListener("hashchange", handleHashChange);
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, [delayStep]);

  return (
    <Component
      ref={elementRef as React.Ref<never>}
      className={["scroll-entry-motion", className].filter(Boolean).join(" ")}
      data-motion-state={motionState}
      data-motion-distance={distance}
      data-motion-delay={delayStep}
      onTransitionEnd={() => {
        if (motionState === "entering") setMotionState("final");
      }}
    >
      {children}
    </Component>
  );
}
