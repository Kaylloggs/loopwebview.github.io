import React from "react";

const Avatar = ({ name, color, size = "md" }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base",
    };
    return (
        <div
            className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-slate-700 font-bold shadow-inner`}
        >
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
};

export default Avatar;
