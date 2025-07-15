import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Download, 
  FileText,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const DocumentHeader = () => {
  const { 
    currentDocument, 
    updateTitle, 
    saveDocument, 
    isSidebarCollapsed, 
    toggleSidebar 
  } = useEditorStore();
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title);
    }
  }, [currentDocument]);

  const handleTitleSubmit = () => {
    if (title.trim() && currentDocument) {
      updateTitle(title.trim());
      setIsEditing(false);
      toast({
        title: "Document renamed",
        description: `Document renamed to "${title.trim()}"`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(currentDocument?.title || '');
      setIsEditing(false);
    }
  };

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
      description: `${currentDocument.title}.html has been downloaded.`,
    });
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 relative z-30">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Sidebar toggle for smaller screens */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 md:hidden"
        >
          {isSidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
        
        <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
        
        {currentDocument ? (
          <div className="flex items-center gap-2 min-w-0">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyPress}
                className="h-8 w-32 md:w-64"
                autoFocus
              />
            ) : (
              <h1 
                className="text-lg md:text-xl font-semibold cursor-pointer hover:bg-muted/50 px-2 py-1 rounded truncate max-w-[200px] md:max-w-none"
                onClick={() => setIsEditing(true)}
                title={currentDocument.title}
              >
                {currentDocument.title}
              </h1>
            )}
          </div>
        ) : (
          <h1 className="text-lg md:text-xl font-semibold truncate">Rich Text Editor</h1>
        )}
      </div>

      {currentDocument && (
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="hidden md:flex gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-8 w-8 p-0 md:hidden"
            title="Save document"
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="hidden md:flex gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-8 w-8 p-0 md:hidden"
            title="Export document"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </header>
  );
};