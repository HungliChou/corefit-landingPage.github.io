import React from 'react';
import type { PlanTag } from '../types';

const PlanBadge: React.FC<{ tag: PlanTag; label: string }> = ({ tag, label }) => (
  <span className={`plan-badge plan-badge--${tag}`}>{label}</span>
);

export default PlanBadge;
