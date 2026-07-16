import React from "react";

const HeaderPage: React.FC<{
  onBack: () => void;
  desc: string;
  title: string;
  subtitle: string;
}> = ({ onBack, desc, title, subtitle }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-auto">
        <span className="ds-eyebrow">{desc}</span>
        <h1 className="ds-heading ds-heading-lg">{title}</h1>
        <p className="text-sm text-[rgb(var(--muted)/1)]">{subtitle}</p>
      </div>
      <a
        className="flex px-2 py-1 hover:bg-gray-100 rounded-sm cursor-pointer"
        onClick={onBack}
      >
        ← Volver a productos
      </a>
    </div>
  );
};

export default HeaderPage;
