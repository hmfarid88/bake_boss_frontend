"use client"
import React from 'react';
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';

interface PrintProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const Print: React.FC<PrintProps> = ({ contentRef }) => {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <button onClick={handlePrint} className='btn btn-ghost btn-square'>
      <FcPrint size={36} />
    </button>
  );
}

export default Print;
