import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeBadgeProps {
  userId: string;
  userName: string;
  qrToken?: string | null;
  roleName?: string;
  className?: string;
}

export function QRCodeBadge({ userId, userName, qrToken, roleName, className = '' }: QRCodeBadgeProps) {
  const qrValue = qrToken || userId;

  return (
    <div className={`flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white w-48 h-64 ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="font-bold text-lg leading-tight text-slate-800 line-clamp-2">{userName}</h3>
        {roleName && <p className="text-sm text-slate-500 mt-1">{roleName}</p>}
      </div>
      
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
        <QRCodeSVG 
          value={qrValue}
          size={120}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"M"}
          includeMargin={false}
        />
      </div>
      
      <div className="mt-4 text-[10px] text-slate-400 font-mono text-center truncate w-full px-2" title={qrValue}>
        {qrValue}
      </div>
    </div>
  );
}
