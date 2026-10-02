"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed? This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // "danger" | "warning" | "primary"
    isLoading = false,
    icon = null,
}) {
    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isLoading, onClose]);

    const variantStyles = {
        danger: {
            iconBg: "bg-red-50 text-red-600",
            defaultIcon: "delete",
            confirmBtn:
                "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
        },
        warning: {
            iconBg: "bg-amber-50 text-amber-600",
            defaultIcon: "warning",
            confirmBtn:
                "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white",
        },
        primary: {
            iconBg: "bg-blue-50 text-blue-600",
            defaultIcon: "info",
            confirmBtn:
                "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;
    const activeIcon = icon || currentVariant.defaultIcon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => !isLoading && onClose?.()}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 28,
                        }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon Circle */}
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentVariant.iconBg}`}
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {activeIcon}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3
                                    id="modal-headline"
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    {title}
                                </h3>
                                <div className="mt-2 text-sm leading-relaxed text-gray-500">
                                    {typeof message === "string" ? (
                                        <p>{message}</p>
                                    ) : (
                                        message
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={onClose}
                                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 cursor-pointer sm:w-auto"
                            >
                                {cancelText}
                            </button>

                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={onConfirm}
                                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 cursor-pointer sm:w-auto ${currentVariant.confirmBtn}`}
                            >
                                {isLoading && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}
                                <span>{confirmText}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
