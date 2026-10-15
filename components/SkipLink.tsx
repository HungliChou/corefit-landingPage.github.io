import React from 'react';

/** 手機選單展開時 <main> 是 inert，略過連結也一併設為 inert，避免 Tab 停在一個指向無法互動區塊的連結上。 */
const SkipLink: React.FC<{ label: string; inert?: boolean }> = ({ label, inert }) => (
  <a href="#main" className="skip-link" inert={inert}>
    {label}
  </a>
);

export default SkipLink;
