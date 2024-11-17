import React from 'react';

interface ProjectStatusProps {
  status: string;
  completion: number;
}

export const ProjectStatus: React.FC<ProjectStatusProps> = ({ status, completion }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            completion >= 75 ? 'bg-emerald-500' :
            completion >= 50 ? 'bg-blue-500' :
            completion >= 25 ? 'bg-amber-500' :
            'bg-rose-500'
          }`}
          style={{ width: `${completion}%` }}
        />
      </div>
      <span className="text-sm text-neutral-400">{completion}%</span>
    </div>
  );
};
