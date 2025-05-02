
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentSectionProps {
  commentaire: string;
  setCommentaire: (value: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  commentaire, 
  setCommentaire 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Commentaires</h3>
      <Textarea
        placeholder="Ajouter des commentaires sur le dossier"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default CommentSection;
