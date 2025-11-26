import React from "react";

const Button = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    icon: Icon,
}) => {
    const baseStyle =
        "flex items-center justify-center font-medium transition-all active:scale-95 rounded-2xl px-6 py-3.5 w-full";
    const variants = {
        primary:
            "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800",
        secondary: "bg-gray-100 text-slate-900 hover:bg-gray-200",
        ghost: "bg-transparent text-slate-500 hover:bg-gray-50",
        danger: "bg-red-50 text-red-500 hover:bg-red-100",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {Icon && <Icon size={20} className="mr-2" />}
            {children}
        </button>
    );
};

export default Button;
