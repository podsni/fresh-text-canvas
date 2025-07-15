import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  FileText, 
  Plus, 
  Download,
  Edit3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DocumentHeader = () => {
  const { 
    currentDocument, 
    createDocument, 
    saveDocument, 
    updateTitle 
  } = useEditorStore();
  const { toast } = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDocument?.title || '');

  const handleSave = () => {
    saveDocument();
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    });
  };

  const handleExport = () => {
    if (!currentDocument) return;
    
    const element = document.createElement('a');
    const file = new Blob([currentDocument.content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentDocument.title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Document exported",
      description: "Your document has been downloaded as HTML.",
    });
  };

  const handleTitleSubmit = () => {
    if (titleValue.trim()) {
      updateTitle(titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitleValue(currentDocument?.title || '');
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="bg-background border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {isEditingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-semibold cursor-pointer hover:text-primary flex items-center gap-2"
                onClick={() => {
                  setTitleValue(currentDocument?.title || '');
                  setIsEditingTitle(true);
                }}
              >
                {currentDocument?.title || 'No Document'}
                <Edit3 className="h-4 w-4 opacity-50" />
              </h1>
            )}
          </div>
          {currentDocument && (
            <div className="text-sm text-muted-foreground">
              Last modified: {currentDocument.lastModified.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => createDocument()}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
          
          {currentDocument && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button 
                size="sm"
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};