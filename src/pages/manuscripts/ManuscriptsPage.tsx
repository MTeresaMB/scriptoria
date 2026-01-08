import { ManuscriptsList } from '@/components/manuscripts/ManuscriptsList';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ManuscriptsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateManuscript = () => {
    navigate('/manuscripts/new?from=manuscripts');
  };

  return (
    <div className="p-6">
      <ManuscriptsList onCreateNewManuscript={handleCreateManuscript} />
    </div>
  );
};

