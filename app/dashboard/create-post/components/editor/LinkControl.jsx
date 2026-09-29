'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Link editing UI. All link behaviour comes from the official
 * `@tiptap/starter-kit` (Link extension) commands: setLink / unsetLink.
 */
const LinkControl = ({ editor, variant = 'toolbar' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [href, setHref] = useState('')
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event) => {
            if (!wrapperRef.current?.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerDown)

        return () => document.removeEventListener('mousedown', handlePointerDown)
    }, [isOpen])

    const openPopover = () => {
        setHref(editor?.getAttributes('link').href ?? '')
        setIsOpen(true)
    }

    const applyLink = () => {
        if (!editor) return

        const chain = editor.chain().focus().extendMarkRange('link')

        if (href.trim() === '') {
            chain.unsetLink().run()
        } else {
            chain.setLink({ href: href.trim() }).run()
        }

        setIsOpen(false)
    }

    const removeLink = () => {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        setHref('')
        setIsOpen(false)
    }

    const isActive = editor?.isActive('link') ?? false

    return (
        <div className='relative' ref={wrapperRef}>
            <button
                type='button'
                aria-label='Link'
                aria-expanded={isOpen}
                title='Link (⌘K)'
                onMouseDown={(event) => {
                    if (variant === 'toolbar') event.preventDefault()
                }}
                onClick={() => (isOpen ? setIsOpen(false) : openPopover())}
                className={
                    variant === 'menu'
                        ? `size-8 inline-flex items-center justify-center rounded-lg transition ${
                              isActive
                                  ? 'bg-slate-900 text-white shadow-sm'
                                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                          }`
                        : `p-1.5 rounded transition ${
                              isActive
                                  ? 'bg-slate-900 text-white'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`
                }
            >
                <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </button>
            {isOpen && (
                <div className='absolute left-0 top-full z-30 mt-1.5 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg space-y-2'>
                    <label
                        className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500'
                        htmlFor='editor-link-href'
                    >
                        Link URL
                    </label>
                    <input
                        id='editor-link-href'
                        autoFocus
                        type='url'
                        inputMode='url'
                        placeholder='https://example.com'
                        value={href}
                        onChange={(event) => setHref(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                applyLink()
                            }
                            if (event.key === 'Escape') setIsOpen(false)
                        }}
                        className='w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-100'
                    />
                    <div className='flex items-center justify-between gap-2 pt-1'>
                        <button
                            type='button'
                            onClick={removeLink}
                            disabled={!isActive}
                            className='rounded-md px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40'
                        >
                            Remove
                        </button>
                        <div className='flex items-center gap-1.5'>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={applyLink}
                                className='rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700'
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinkControl
