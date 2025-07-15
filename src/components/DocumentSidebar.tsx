import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Trash2, 
  Plus,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const DocumentSidebar = () => {
  const { 
    documents, 
    currentDocument, 
    loadDocument, 
    deleteDocument, 
    createDocument 
  } = useEditorStore();
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="w-72 bg-secondary/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Documents</h2>
          <Button 
            size="sm"
            onClick={() => createDocument()}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredDocuments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No documents match your search' : 'No documents yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                    currentDocument?.id === doc.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => loadDocument(doc.id)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(doc.lastModified)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
  );
};