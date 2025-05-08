
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  timestamp: string;
  avatar?: string;
}

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Charger les commentaires existants
  useEffect(() => {
    const loadComments = () => {
      try {
        const savedComments = localStorage.getItem(`comments_${documentId}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    };
    
    loadComments();
  }, [documentId]);

  // Sauvegarder les commentaires
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${documentId}`, JSON.stringify(comments));
    }
  }, [comments, documentId]);

  // Ajouter un commentaire
  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      text: newComment.trim(),
      author: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été ajouté au document"
    });
  };

  // Supprimer un commentaire
  const handleDeleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
    
    toast({
      title: "Commentaire supprimé",
      description: "Le commentaire a été supprimé"
    });
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-md font-medium mb-2">Commentaires</h3>
      
      <ScrollArea className="flex-1 pr-4 mb-4 max-h-[300px]">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Aucun commentaire sur ce document
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {comment.avatar ? (
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                      ) : (
                        <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{comment.author}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="mt-auto">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="flex items-center gap-1"
          >
            <Send size={14} className="mr-1" />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentComments;
