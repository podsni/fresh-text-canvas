import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { DocumentHeader } from '@/components/DocumentHeader';
import { DocumentSidebar } from '@/components/DocumentSidebar';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const Index = () => {
  const { currentDocument, createDocument, documents } = useEditorStore();

  // Create a default document if none exists
  useEffect(() => {
    if (documents.length === 0) {
      createDocument('Welcome Document');
    }
  }, [documents.length, createDocument]);

  if (!currentDocument && documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Rich Text Editor</h1>
          <p className="text-muted-foreground max-w-md">
            Create beautiful documents with our modern rich text editor. 
            Start by creating your first document.
          </p>
          <Button onClick={() => createDocument()} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <DocumentHeader />
      <div className="flex-1 flex overflow-hidden">
        <DocumentSidebar />
        <main className="flex-1 p-6">
          {currentDocument ? (
            <RichTextEditor />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">Select a document</h2>
                <p className="text-muted-foreground">
                  Choose a document from the sidebar or create a new one
                </p>
                <Button onClick={() => createDocument()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
