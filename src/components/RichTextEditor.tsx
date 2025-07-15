import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import History from '@tiptap/extension-history';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import { useEditorStore } from '@/store/editorStore';
import { Toolbar } from './Toolbar';
import { useEffect, useCallback } from 'react';

export const RichTextEditor = () => {
  const { currentDocument, updateDocument } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Dropcursor,
      Gapcursor,
    ],
    content: currentDocument?.content || '<p>Start typing to get started...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateDocument(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-6 prose-headings:mt-6 prose-headings:mb-4 prose-p:my-2 prose-li:my-1',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.includes('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              const { tr } = view.state;
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (pos) {
                tr.insert(pos.pos, view.state.schema.nodes.image.create({ src: url }));
                view.dispatch(tr);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
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

  // Handle image uploads
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  return (
    <div className="h-full flex flex-col bg-editor-bg border border-editor-border rounded-lg overflow-hidden shadow-sm">
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};