import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  created: Date;
}

interface EditorState {
  currentDocument: Document | null;
  documents: Document[];
  isLoading: boolean;
  
  // Actions
  createDocument: (title?: string) => void;
  updateDocument: (content: string) => void;
  saveDocument: () => void;
  loadDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  updateTitle: (title: string) => void;
}

const createNewDocument = (title: string = 'Untitled Document'): Document => ({
  id: crypto.randomUUID(),
  title,
  content: '',
  lastModified: new Date(),
  created: new Date(),
});

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      currentDocument: null,
      documents: [],
      isLoading: false,

      createDocument: (title = 'Untitled Document') => {
        const newDoc = createNewDocument(title);
        set(state => ({
          currentDocument: newDoc,
          documents: [newDoc, ...state.documents]
        }));
      },

      updateDocument: (content: string) => {
        const { currentDocument } = get();
        if (!currentDocument) return;

        const updatedDoc = {
          ...currentDocument,
          content,
          lastModified: new Date(),
        };

        set(state => ({
          currentDocument: updatedDoc,
          documents: state.documents.map(doc => 
            doc.id === updatedDoc.id ? updatedDoc : doc
          )
        }));
      },

      saveDocument: () => {
        const { currentDocument } = get();
        if (!currentDocument) return;

        // In a real app, this would save to a backend
        console.log('Document saved:', currentDocument.title);
      },

      loadDocument: (id: string) => {
        const { documents } = get();
        const document = documents.find(doc => doc.id === id);
        if (document) {
          set({ currentDocument: document });
        }
      },

      deleteDocument: (id: string) => {
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== id),
          currentDocument: state.currentDocument?.id === id ? null : state.currentDocument
        }));
      },

      updateTitle: (title: string) => {
        const { currentDocument } = get();
        if (!currentDocument) return;

        const updatedDoc = {
          ...currentDocument,
          title,
          lastModified: new Date(),
        };

        set(state => ({
          currentDocument: updatedDoc,
          documents: state.documents.map(doc => 
            doc.id === updatedDoc.id ? updatedDoc : doc
          )
        }));
      },
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        documents: state.documents,
        currentDocument: state.currentDocument,
      }),
    }
  )
);