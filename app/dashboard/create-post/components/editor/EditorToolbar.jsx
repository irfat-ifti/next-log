'use client'

import { useEditorState } from '@tiptap/react'
import ToolbarButton from './ToolbarButton'
import LinkControl from './LinkControl'

const BLOCK_OPTIONS = [
    { value: 'paragraph', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' },
]

const EMPTY_STATE = {
    block: 'paragraph',
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
    canUndo: false,
    canRedo: false,
}

const Separator = () => <div className='h-4 w-px bg-slate-200 mx-1' />

const EditorToolbar = ({ editor }) => {
    const state =
        useEditorState({
            editor,
            selector: ({ editor: instance }) => {
                if (!instance) return EMPTY_STATE

                const headingLevel = [1, 2, 3, 4, 5, 6].find((level) =>
                    instance.isActive('heading', { level })
                )

                return {
                    block: headingLevel ? `h${headingLevel}` : 'paragraph',
                    bold: instance.isActive('bold'),
                    italic: instance.isActive('italic'),
                    underline: instance.isActive('underline'),
                    strike: instance.isActive('strike'),
                    code: instance.isActive('code'),
                    bulletList: instance.isActive('bulletList'),
                    orderedList: instance.isActive('orderedList'),
                    blockquote: instance.isActive('blockquote'),
                    codeBlock: instance.isActive('codeBlock'),
                    canUndo: instance.can().chain().focus().undo().run(),
                    canRedo: instance.can().chain().focus().redo().run(),
                }
            },
        }) ?? EMPTY_STATE

    const setBlock = (value) => {
        if (!editor) return

        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run()
            return
        }

        editor.chain().focus().toggleHeading({ level: Number(value.slice(1)) }).run()
    }

    return (
        <div
            role='toolbar'
            aria-label='Text formatting'
            aria-controls='rich-text-editor'
            className='flex items-center gap-1.5 flex-wrap'
        >
            <select
                aria-label='Text style'
                title='Text style'
                value={state.block}
                disabled={!editor?.isEditable}
                onChange={(event) => setBlock(event.target.value)}
                className='px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 outline-none disabled:opacity-40'
            >
                {BLOCK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <Separator />

            <ToolbarButton
                editor={editor}
                label='Bold'
                shortcut='⌘B'
                isActive={state.bold}
                onClick={() => editor?.chain().focus().toggleBold().run()}
            >
                <span className='font-bold text-xs'>B</span>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Italic'
                shortcut='⌘I'
                isActive={state.italic}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
                <span className='italic text-xs font-serif'>I</span>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Underline'
                shortcut='⌘U'
                isActive={state.underline}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
                <span className='underline text-xs'>U</span>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Strikethrough'
                shortcut='⌘⇧X'
                isActive={state.strike}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
            >
                <span className='line-through text-xs'>S</span>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Inline code'
                shortcut='⌘E'
                isActive={state.code}
                onClick={() => editor?.chain().focus().toggleCode().run()}
            >
                <span className='font-mono text-[11px]'>{'</>'}</span>
            </ToolbarButton>

            <Separator />

            <LinkControl editor={editor} />

            <Separator />

            <ToolbarButton
                editor={editor}
                label='Bullet list'
                isActive={state.bulletList}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M4 6h16M4 12h16M4 18h16'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Ordered list'
                isActive={state.orderedList}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Blockquote'
                isActive={state.blockquote}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
                <span className='font-serif text-sm font-semibold'>“</span>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Code block'
                isActive={state.codeBlock}
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Horizontal rule'
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M4 12h16'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Hard break'
                shortcut='⇧⏎'
                onClick={() => editor?.chain().focus().setHardBreak().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M12 4v16m0-4l-4-4m4 4l4-4M4 4h6'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>

            <Separator />

            <ToolbarButton
                editor={editor}
                label='Clear formatting'
                onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M6 4h12M9 20h6M10 4l1.5 12'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                    <path
                        d='M4 4l16 16'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Undo'
                shortcut='⌘Z'
                isDisabled={!state.canUndo}
                onClick={() => editor?.chain().focus().undo().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                editor={editor}
                label='Redo'
                shortcut='⌘⇧Z'
                isDisabled={!state.canRedo}
                onClick={() => editor?.chain().focus().redo().run()}
            >
                <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        d='M15 14l5-5-5-5m5 5H10a6 6 0 000 12h3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                    />
                </svg>
            </ToolbarButton>
        </div>
    )
}

export default EditorToolbar
