'use client'

import { useEditorState } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import LinkControl from './LinkControl'

const MENU_CLASS =
    'flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5'

const HEADING_GROUP_CLASS =
    'flex items-center gap-0.5 rounded-xl bg-slate-50 p-0.5 ring-1 ring-slate-200/80'

const HEADING_ITEMS = [
    { level: 1, size: 'text-[13px]' },
    { level: 2, size: 'text-xs' },
    { level: 3, size: 'text-[11px]' },
    { level: 4, size: 'text-[10px]' },
    { level: 5, size: 'text-[9px]' },
    { level: 6, size: 'text-[8px]' },
]

const headingButtonClass = (isActive) =>
    `h-6 min-w-6 px-1.5 inline-flex items-center justify-center rounded-lg font-serif font-bold transition select-none ${
        isActive
            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
            : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
    }`

const actionButtonClass = (isActive) =>
    `size-8 inline-flex items-center justify-center rounded-lg transition select-none ${
        isActive
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`

const Divider = () => <span className='w-px h-5 mx-0.5 bg-slate-200' />

const ICONS = {
    bulletList: 'M4 6h16M4 12h16M4 18h16',
    orderedList: 'M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01',
}

const Icon = ({ path }) => (
    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path d={path} strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
    </svg>
)

/**
 * Official Tiptap floating / bubble menus. Every button is wired to a Tiptap
 * command and reads its state from `editor.isActive(...)`.
 */
const EditorMenus = ({ editor }) => {
    const state =
        useEditorState({
            editor,
            selector: ({ editor: instance }) => ({
                bold: instance?.isActive('bold') ?? false,
                italic: instance?.isActive('italic') ?? false,
                underline: instance?.isActive('underline') ?? false,
                strike: instance?.isActive('strike') ?? false,
                code: instance?.isActive('code') ?? false,
                headingLevel:
                    [1, 2, 3, 4, 5, 6].find((level) =>
                        instance?.isActive('heading', { level })
                    ) ?? null,
                bulletList: instance?.isActive('bulletList') ?? false,
                orderedList: instance?.isActive('orderedList') ?? false,
                blockquote: instance?.isActive('blockquote') ?? false,
                codeBlock: instance?.isActive('codeBlock') ?? false,
            }),
        }) ?? {
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            code: false,
            headingLevel: null,
            bulletList: false,
            orderedList: false,
            blockquote: false,
            codeBlock: false,
        }

    if (!editor) return null

    return (
        <>
            {/* Selection menu */}
            <BubbleMenu
                editor={editor}
                options={{ placement: 'top' }}
                shouldShow={({ editor: instance, from, to }) =>
                    from !== to || instance.isActive('link')
                }
                className={MENU_CLASS}
            >
                <button
                    type='button'
                    aria-label='Bold'
                    aria-pressed={state.bold}
                    title='Bold'
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={actionButtonClass(state.bold)}
                >
                    <span className='font-serif text-sm font-bold'>B</span>
                </button>
                <button
                    type='button'
                    aria-label='Italic'
                    aria-pressed={state.italic}
                    title='Italic'
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={actionButtonClass(state.italic)}
                >
                    <span className='font-serif text-sm italic'>I</span>
                </button>
                <button
                    type='button'
                    aria-label='Underline'
                    aria-pressed={state.underline}
                    title='Underline'
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={actionButtonClass(state.underline)}
                >
                    <span className='font-serif text-sm underline'>U</span>
                </button>
                <button
                    type='button'
                    aria-label='Strikethrough'
                    aria-pressed={state.strike}
                    title='Strikethrough'
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={actionButtonClass(state.strike)}
                >
                    <span className='font-serif text-sm line-through'>S</span>
                </button>
                <button
                    type='button'
                    aria-label='Inline code'
                    aria-pressed={state.code}
                    title='Inline code'
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={actionButtonClass(state.code)}
                >
                    <span className='font-mono text-[11px] font-semibold'>{'</>'}</span>
                </button>
                <Divider />
                <LinkControl editor={editor} variant='menu' />
            </BubbleMenu>

            {/* Empty-line menu */}
            <FloatingMenu
                editor={editor}
                options={{ placement: 'top' }}
                shouldShow={({ editor: instance, from, to }) =>
                    from === to && !instance.isActive('codeBlock')
                }
                className={MENU_CLASS}
            >
                <div className={HEADING_GROUP_CLASS}>
                    {HEADING_ITEMS.map((item) => (
                        <button
                            key={item.level}
                            type='button'
                            aria-label={`Heading ${item.level}`}
                            aria-pressed={state.headingLevel === item.level}
                            title={`Heading ${item.level}`}
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: item.level }).run()
                            }
                            className={headingButtonClass(state.headingLevel === item.level)}
                        >
                            <span className={item.size}>H{item.level}</span>
                        </button>
                    ))}
                </div>
                <Divider />
                <button
                    type='button'
                    aria-label='Bullet list'
                    aria-pressed={state.bulletList}
                    title='Bullet list'
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={actionButtonClass(state.bulletList)}
                >
                    <Icon path={ICONS.bulletList} />
                </button>
                <button
                    type='button'
                    aria-label='Ordered list'
                    aria-pressed={state.orderedList}
                    title='Ordered list'
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={actionButtonClass(state.orderedList)}
                >
                    <Icon path={ICONS.orderedList} />
                </button>
                <button
                    type='button'
                    aria-label='Blockquote'
                    aria-pressed={state.blockquote}
                    title='Blockquote'
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={actionButtonClass(state.blockquote)}
                >
                    <span className='font-serif text-base leading-none'>“</span>
                </button>
                <button
                    type='button'
                    aria-label='Code block'
                    aria-pressed={state.codeBlock}
                    title='Code block'
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={actionButtonClass(state.codeBlock)}
                >
                    <span className='font-mono text-[11px] font-semibold'>{'</>'}</span>
                </button>
            </FloatingMenu>
        </>
    )
}

export default EditorMenus
