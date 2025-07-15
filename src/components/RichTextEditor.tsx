import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEditorStore } from '@/store/editorStore';
import { Toolbar } from './Toolbar';
import { useEffect } from 'react';

export const RichTextEditor = () => {
  const { currentDocument, updateDocument } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
    ],
    content: currentDocument?.content || '<p>Start typing to get started...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateDocument(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-6',
      },
    },
  });

  // Update editor content when document changes
  useEffect(() => {
    if (editor && currentDocument) {
      const currentContent = editor.getHTML();
      if (currentContent !== currentDocument.content) {
        editor.commands.setContent(currentDocument.content || '<p>Start typing to get started...</p>');
      }
    }
  }, [currentDocument, editor]);

  return (
    <div className="h-full flex flex-col bg-editor-bg border border-editor-border rounded-lg overflow-hidden shadow-sm">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};