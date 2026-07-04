import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70';
  const variants = {
    primary: 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-soft hover:-translate-y-0.5 hover:brightness-110',
    secondary: 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
