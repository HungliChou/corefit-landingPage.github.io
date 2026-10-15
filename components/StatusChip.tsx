import React from 'react';

/** 上架狀態：純說明文字（小圓點＋灰字），不做成膠囊或按鈕外觀，避免被誤認為可點。 */
const StatusChip: React.FC<{ label: string; className?: string }> = ({ label, className = '' }) => (
  <p className={`status-note ${className}`}>
    <span className="status-note__dot" aria-hidden="true" />
    <span>{label}</span>
  </p>
);

export default StatusChip;
