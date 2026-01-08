import { NotesList } from '@/components/notes/NotesList';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/notes/new?from=notes');
  };

  return (
    <div className="p-6">
      <NotesList onCreateNewNote={handleCreateNote} />
    </div>
  );
};
