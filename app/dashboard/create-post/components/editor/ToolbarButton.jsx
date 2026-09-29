'use client'

const ToolbarButton = ({
    editor,
    label,
    shortcut,
    isActive = false,
    isDisabled = false,
    onClick,
    children,
}) => {
    return (
        <button
            type='button'
            aria-label={label}
            aria-pressed={isActive}
            title={shortcut ? `${label} (${shortcut})` : label}
            disabled={isDisabled || !editor?.isEditable}
            onMouseDown={(event) => {
                // Keep the editor selection/focus while clicking the toolbar
                event.preventDefault()
            }}
            onClick={onClick}
            className={`p-1.5 rounded transition disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
            {children}
        </button>
    )
}

export default ToolbarButton
