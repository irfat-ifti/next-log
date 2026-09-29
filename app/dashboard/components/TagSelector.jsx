import { useMemo, useState } from "react";

function TagSelector({ tagList = [], selectedTags = [], setSelectedTags }) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const suggestions = useMemo(() => {
        const search = inputValue.trim().toLowerCase();

        if (!search) return [];

        return tagList
            .filter((tag) => {
                const name = tag.name?.toLowerCase() || "";
                const slug = tag.slug?.toLowerCase() || "";

                return (
                    name.includes(search) ||
                    slug.includes(search)
                );
            })
            .filter(
                (tag) =>
                    !selectedTags.some(
                        (selected) => selected.id === tag.id
                    )
            )
            .slice(0, 8);
    }, [inputValue, tagList, selectedTags]);

    const selectTag = (tag) => {
        // Already selected হলে কিছু করবে না
        if (selectedTags.some((item) => item.id === tag.id)) {
            return;
        }

        setSelectedTags([...selectedTags, tag]);

        setInputValue("");
        setIsOpen(false);
    };

    const removeTag = (tagId) => {
        setSelectedTags(
            selectedTags.filter((tag) => tag.id !== tagId)
        );
    };

    const handleKeyDown = (e) => {
        // Enter চাপলে first suggestion select
        if (e.key === "Enter") {
            e.preventDefault();

            if (suggestions.length > 0) {
                selectTag(suggestions[0]);
            }
        }

        // Backspace দিয়ে input empty থাকলে last tag remove
        if (
            e.key === "Backspace" &&
            !inputValue &&
            selectedTags.length > 0
        ) {
            removeTag(selectedTags[selectedTags.length - 1].id);
        }
    };

    return (
        <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags
            </label>

            {/* Input container */}
            <div
                className={`flex flex-wrap items-center gap-1.5 border rounded-lg px-2.5 py-1.5 bg-white min-h-10 transition
                    ${
                        isOpen
                            ? "border-blue-400 ring-2 ring-blue-100"
                            : "border-slate-200"
                    }
                `}
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                {/* Selected tags */}
                {selectedTags.map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium"
                    >
                        {tag.name || tag.slug}

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag.id);
                            }}
                            className="hover:text-blue-900"
                        >
                            ×
                        </button>
                    </span>
                ))}

                {/* Search input */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        selectedTags.length === 0
                            ? "Search tags..."
                            : "Add tag..."
                    }
                    className="flex-1 min-w-24 outline-none border-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent py-0.5"
                />

                {/* Arrow */}
                <svg
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                    />
                </svg>
            </div>

            {/* Suggestions */}
            {isOpen && inputValue.trim() && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.length > 0 ? (
                        <div className="py-1">
                            {suggestions.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => selectTag(tag)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition"
                                >
                                    <div>
                                        <div className="text-sm font-medium text-slate-700">
                                            {tag.name || tag.slug}
                                        </div>

                                        {tag.slug &&
                                            tag.name !== tag.slug && (
                                                <div className="text-xs text-slate-400">
                                                    {tag.slug}
                                                </div>
                                            )}
                                    </div>

                                    <span className="text-xs text-blue-500">
                                        Select
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-3 py-3 text-sm text-slate-400">
                            No tags found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TagSelector;
