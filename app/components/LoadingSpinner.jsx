"use client";

import { TailSpin } from "react-loader-spinner";

export default function LoadingSpinner({
    size = 40,
    color = "#2563eb",
    label = "",
    fullScreen = false,
    inline = false,
    className = "",
}) {
    if (inline) {
        return (
            <span className={`inline-flex items-center gap-2 ${className}`}>
                <TailSpin
                    height={size}
                    width={size}
                    color={color}
                    ariaLabel="loading"
                    radius="1"
                    visible={true}
                />
                {label && <span className="text-sm font-medium">{label}</span>}
            </span>
        );
    }

    if (fullScreen) {
        return (
            <div className={`min-h-[60vh] w-full flex flex-col items-center justify-center gap-3 p-8 ${className}`}>
                <TailSpin
                    height={size || 50}
                    width={size || 50}
                    color={color}
                    ariaLabel="loading"
                    radius="1"
                    visible={true}
                />
                {label && (
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                        {label}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
            <TailSpin
                height={size}
                width={size}
                color={color}
                ariaLabel="loading"
                radius="1"
                visible={true}
            />
            {label && (
                <p className="text-sm font-medium text-gray-500">
                    {label}
                </p>
            )}
        </div>
    );
}
