import { styled } from '@mui/material/styles'
import { StarterKit } from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Box, Divider, FormControl, FormHelperText, FormLabel, IconButton } from '@mui/material'
import {
  Code,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Redo,
  Undo,
} from '@mui/icons-material'

const StyledEditorWrapper = styled(Box)(({ theme }) => ({
  'border': `1px solid ${theme.palette.divider}`,
  'borderRadius': theme.shape.borderRadius,
  'minHeight': '120px',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
  '& .tiptap': {
    'padding': theme.spacing(1),
    'outline': 'none',
    'minHeight': '100px',
    '& p': {
      'margin': 0,
      '&:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
    '& ul, & ol': {
      paddingLeft: theme.spacing(2),
    },
    '& blockquote': {
      paddingLeft: theme.spacing(2),
      borderLeft: `4px solid ${theme.palette.divider}`,
      marginLeft: 0,
      marginRight: 0,
    },
    '& code': {
      backgroundColor: theme.palette.grey[100],
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '0.875em',
    },
    '& pre': {
      'backgroundColor': theme.palette.grey[100],
      'padding': theme.spacing(1),
      'borderRadius': theme.shape.borderRadius,
      'overflow': 'auto',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  },
}))

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}))

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
}

export interface RichTextEditorRef {
  focus: () => void
  blur: () => void
  getHTML: () => string
  getText: () => string
}

interface ToolbarProps {
  editor: any
}

function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <StyledToolbar>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        color={editor.isActive('bold') ? 'primary' : 'default'}
      >
        <FormatBold fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        color={editor.isActive('italic') ? 'primary' : 'default'}
      >
        <FormatItalic fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleCode().run()}
        color={editor.isActive('code') ? 'primary' : 'default'}
      >
        <Code fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        color={editor.isActive('bulletList') ? 'primary' : 'default'}
      >
        <FormatListBulleted fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        color={editor.isActive('orderedList') ? 'primary' : 'default'}
      >
        <FormatListNumbered fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        color={editor.isActive('blockquote') ? 'primary' : 'default'}
      >
        <FormatQuote fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo fontSize="small" />
      </IconButton>
    </StyledToolbar>
  )
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', onChange, placeholder, label, error, helperText, disabled, required }, ref) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html)
      },
      editorProps: {
        attributes: {
          'data-placeholder': placeholder || '',
        },
      },
    })

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
      getHTML: () => editor?.getHTML() || '',
      getText: () => editor?.getText() || '',
    }), [editor])

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value, false)
      }
    }, [editor, value])

    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        {label && (
          <FormLabel component="legend" required={required}>
            {label}
          </FormLabel>
        )}
        <StyledEditorWrapper>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </StyledEditorWrapper>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  },
)

RichTextEditor.displayName = 'RichTextEditor'
