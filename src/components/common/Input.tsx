import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <label className="block text-sm leading-6 text-slate-700">
      {label && <span className="mb-2 block font-semibold">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-xs text-rose-500">{error}</span>}
    </label>
  );
};
