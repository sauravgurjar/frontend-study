import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-slate-700">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/60 ${className}`}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
};
