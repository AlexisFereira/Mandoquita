import React, { forwardRef, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

type InputProps = React.ComponentProps<typeof Input>;

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);
    const labelText = String(props.label ?? "contraseña").toLowerCase();

    return (
      <div className="space-y-2">
        <Input {...props} ref={ref} type={visible ? "text" : "password"} />
        <Button
          type="button"
          variant="ghost"
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? `Ocultar ${labelText}` : `Mostrar ${labelText}`}
        </Button>
      </div>
    );
  },
);
