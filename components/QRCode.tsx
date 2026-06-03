
import React, { useMemo } from 'react';
import QRCodeGenerator from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
}

/**
 * Generates a functional QR code for the provided value.
 * Includes a decorative container for better visual integration.
 */
const QRCode: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
  // Memoize size calculations to prevent unnecessary re-renders
  const containerSize = useMemo(() => size + 32, [size]);

  return (
    <div
      className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden"
      style={{ width: containerSize, height: containerSize }}
    >
      <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
        <QRCodeGenerator
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={value}
          viewBox={`0 0 256 256`}
          level="H" // High error correction for density and reliability
          fgColor="#1e293b" // Slate-800 for better contrast than pure black
          bgColor="transparent"
        />
      </div>
    </div>
  );
};

export default QRCode;
