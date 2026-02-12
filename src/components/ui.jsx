import React from "react";
//全体として、毎回プログラムを書かなくてもいいようにまとめている。一貫したデザインを作ることができる。
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Panel({ className = "", children, ...props }) {
  return (
    <div
      className={cx(
        "rounded-2xl border-2 border-slate-100 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ variant = "neutral", className = "", children, ...props }) {
  const variants = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant] || variants.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  type,
  children,
  ...props
}) {
  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    outline:
      "border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-300",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-5 py-3 text-base rounded-2xl",
  };

  return (
    <button
      type={type || "button"}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center font-semibold shadow-sm transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  maxLength,
  autoComplete,
  icon,
  className = "",
  helpText,
  disabled = false,
}) {
  return (
    <label className={cx("block", className)}>
      {label && (
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          {required && <span className="text-xs font-semibold text-red-500">*</span>}
        </div>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cx(
            "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-slate-50",
            icon ? "pl-10" : "",
          )}
        />
      </div>
      {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) {
  return (
    <label className={cx("block", className)}>
      {label && (
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          {required && <span className="text-xs font-semibold text-red-500">*</span>}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-slate-50"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Alert({ variant = "info", className = "", children }) {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-800",
  };
  return (
    <div
      className={cx(
        "rounded-2xl border-2 px-4 py-3 text-sm font-medium",
        variants[variant] || variants.info,
        className
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <Panel className="p-10 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Panel>
  );
}
