
import React from 'react';
import { CardData } from '../types';
import QRCode from './QRCode';

interface IDCardProps {
  data: CardData;
}

const IDCard: React.FC<IDCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-[#1E1E1E] rounded-[32px] shadow-2xl dark:shadow-black/50 overflow-hidden border border-gray-100 dark:border-white/5 transition-all duration-300 transform">
      {/* Top Section - Brand and Identity */}
      <div className="px-8 pt-8 pb-4 flex flex-col gap-0.5">
        <h1
          className="text-2xl font-extrabold tracking-tight leading-none"
          style={{ color: data.accentColor }}
        >
          {data.universityName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-base uppercase tracking-wide">
          {data.studentName}
        </p>
        <div className="mt-2 inline-flex items-center">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
          <span className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 tracking-tighter uppercase">
            Gültigkeitszeitraum {data.validUntil}
          </span>
        </div>
      </div>

      {/* Center Section - QR Code or Photo */}
      <div className="flex-grow flex flex-col items-center justify-center px-8 min-h-0">
        <div className="p-1 w-full flex justify-center">
          {data.photoUrl ? (
            <div
              className="bg-white p-2 rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden"
              style={{ width: 180 + 32, height: 180 + 32 }}
            >
              <img
                src={data.photoUrl}
                alt="Student Photo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ) : data.qrImageUrl ? (
            <div
              className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden"
              style={{ width: 180 + 32, height: 180 + 32 }}
            >
              <img
                src={data.qrImageUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <QRCode value={data.qrValue} size={180} />
          )}
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight text-center">
          {data.qrTitle}
        </h3>
      </div>

      {/* Bottom Section - Dynamic Structured Fields */}
      <div className="bg-gray-50 dark:bg-white/[0.03] px-8 py-6 flex flex-col gap-4 border-t border-gray-100 dark:border-white/5">
        {(() => {
          // Helper to chunk fields into pairs for the grid
          const rows = [];
          for (let i = 0; i < data.fields.length; i += 2) {
            rows.push(data.fields.slice(i, i + 2));
          }

          return rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-between items-center w-full">
              {row.map((field, cellIdx) => (
                <div
                  key={cellIdx}
                  className={`flex flex-col ${field.align === 'right' ? 'text-right' : ''} ${row.length === 1 ? 'w-full' : ''}`}
                >
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em]">
                    {field.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default IDCard;
