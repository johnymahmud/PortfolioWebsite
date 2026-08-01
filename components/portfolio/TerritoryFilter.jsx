'use client';

import { TERRITORY_OPTIONS } from '@/lib/supabase/projects';

export default function TerritoryFilter({ activeTerritory, onSelectTerritory }) {
  return (
    <div className="territory-filter-bar">
      {TERRITORY_OPTIONS.map((option) => {
        const isActive = activeTerritory === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`territory-filter-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelectTerritory(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
