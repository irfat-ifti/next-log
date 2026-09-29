'use client'

import { useEffect, useImperativeHandle, useRef } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import EditorToolbar from './editor/EditorToolbar'
import EditorMenus from './editor/EditorMenus'

const DEFAULT_CONTENT = ""

const RichTextEditor = ({
    initialContent = DEFAULT_CONTENT,
    placeholder = 'Write something, or type “#” for a heading …',
    editable = true,
    onChange,
    className = '',
    ref,
}) => {
    const onChangeRef = useRef(onChange)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                link: {
                    autolink: true,
                    linkOnPaste: true,
                    openOnClick: false,
                    enableClickSelection: true,
                    defaultProtocol: 'https',
                    HTMLAttributes: {
                        rel: 'noopener noreferrer nofollow',
                        target: '_blank',
                    },
                },
            }),
            Typography,
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount,
        ],
        content: initialContent,
        editable,
        // Required for Next.js App Router SSR (avoids hydration mismatch)
        immediatelyRender: false,
        // The toolbar subscribes through useEditorState, so the editor itself
        // does not need to re-render on every transaction.
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                id: 'rich-text-editor',
                'aria-label': 'Post content',
                class: 'focus:outline-none min-h-[320px]',
            },
        },
        onUpdate: ({ editor: instance }) => {
            onChangeRef.current?.({
                html: instance.getHTML(),
                json: instance.getJSON(),
            })
        },
    })

    useEffect(() => {
        editor?.setEditable(editable)
    }, [editor, editable])

    useImperativeHandle(
        ref,
        () => ({
            getHTML: () => editor?.getHTML() ?? '',
            getJSON: () => editor?.getJSON() ?? { type: 'doc', content: [] },
            getText: () => editor?.getText() ?? '',
            focus: () => editor?.commands.focus(),
        }),
        [editor]
    )

    const counts =
        useEditorState({
            editor,
            selector: ({ editor: instance }) => ({
                words: instance?.storage.characterCount.words() ?? 0,
                characters: instance?.storage.characterCount.characters() ?? 0,
            }),
        }) ?? { words: 0, characters: 0 }

    const isEmpty =
        useEditorState({
            editor,
            selector: ({ editor: instance }) => instance?.isEmpty ?? true,
        }) ?? true

    return (
        <section
            className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible ${className}`}
            data-purpose='content-editor-card'
        >
            {/* Header + toolbar */}
            <div className='px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                    <span className='p-1 rounded-md bg-blue-50 text-blue-600'>
                        <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                d='M4 6h16M4 12h8m-8 6h16'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                            />
                        </svg>
                    </span>
                    <span className='font-bold text-slate-900 text-sm'>Content</span>
                </div>
                <EditorToolbar editor={editor} />
            </div>

            <EditorMenus editor={editor} />

            {/* Editor canvas */}
            <div className='p-6 text-sm text-slate-700 leading-relaxed font-normal'>
                <EditorContent editor={editor} />
            </div>

            {/* Status bar: counts come from the CharacterCount extension */}
            <div className='px-6 py-2.5 border-t border-slate-200 flex items-center justify-between gap-3 text-[11px] text-slate-500'>
                <span>
                    Markdown shortcuts: <code className='font-mono'># </code> heading ·{' '}
                    <code className='font-mono'>&gt; </code> quote ·{' '}
                    <code className='font-mono'>- </code> list ·{' '}
                    <code className='font-mono'>``` </code> code
                </span>
                <span className='flex items-center gap-3'>
                    <span aria-live='polite'>{counts.words} words</span>
                    <span aria-hidden='true'>·</span>
                    <span>{counts.characters} characters</span>
                    {isEmpty && <span className='text-amber-600'>Empty draft</span>}
                </span>
            </div>
        </section>
    )
}

export default RichTextEditor
