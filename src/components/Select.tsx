import React from "react";
import type { FC } from "react";

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  label?: string;
  id?: string;
  error?: string;
};

const Select: FC<Props> = ({
  value,
  onChange,
  disabled,
  options,
  label,
  id,
  error,
}) => {
  const classNameBase =
    "block w-full min-h-10 px-2 border border-2 border-gray-100 disabled:bg-gray-100 rounded-md border-gray-300  sm:text-sm";

  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={classNameBase}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Seleccione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <small>{error}</small>}
    </>
  );
};

export default Select;
