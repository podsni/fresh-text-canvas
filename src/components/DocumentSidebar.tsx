import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Trash2, 
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const DocumentSidebar = () => {
  const { 
    documents, 
    currentDocument, 
    loadDocument, 
    deleteDocument, 
    createDocument,
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  } = useEditorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isSidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarCollapsed, isSidebarCollapsed]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      {/* Sidebar Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 left-4 z-50 h-8 w-8 p-0 bg-background border shadow-sm hover:bg-muted transition-all duration-200",
          isSidebarCollapsed ? "translate-x-0" : "translate-x-64 md:translate-x-72"
        )}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar-background border-r border-sidebar-border z-40 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed 
            ? "-translate-x-full md:-translate-x-full" 
            : "translate-x-0",
          "w-64 md:w-72"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4 pt-8">
            <h2 className="font-semibold text-lg text-sidebar-foreground">Documents</h2>
            <Button 
              size="sm"
              onClick={() => createDocument()}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredDocuments.length === 0 ? (
              <div className="text-center text-sidebar-foreground/60 py-8 text-sm">
                {searchTerm ? 'No documents match your search' : 'No documents yet'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "group relative rounded-lg p-3 cursor-pointer transition-colors",
                      currentDocument?.id === doc.id 
                        ? 'bg-sidebar-accent border border-sidebar-primary/20 text-sidebar-primary' 
                        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                    )}
                    onClick={() => {
                      loadDocument(doc.id);
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 mt-1 text-sidebar-foreground/70 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-sidebar-foreground/50 mt-1">
                          {formatDate(doc.lastModified)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!isSidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </>
  );
};