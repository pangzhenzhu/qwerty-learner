import React, { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziWriterProps {
  character: string;
  size?: number;
  showOutline?: boolean;
  strokeColor?: string;
}

const HanziWriterComponent: React.FC<HanziWriterProps> = ({ 
  character, 
  size = 200,
  showOutline = true,
  strokeColor = '#5B21B6' // indigo-900 like
}) => {
  const writerRef = useRef<HanziWriter | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      writerRef.current = HanziWriter.create(divRef.current, character, {
        width: size,
        height: size,
        padding: 5,
        showOutline: showOutline,
        strokeColor: strokeColor,
        delayBetweenStrokes: 200,
        radicalColor: '#166534', // green-800
      });

      // Animate on load
      writerRef.current.animateCharacter();
    }

    return () => {
      // Cleanup if necessary, though HanziWriter doesn't expose a destroy method easily
      // we can clear the innerHTML
      if (divRef.current) {
        divRef.current.innerHTML = '';
      }
    };
  }, [character, size, showOutline, strokeColor]);

  const animate = () => {
    writerRef.current?.animateCharacter();
  };

  const quiz = () => {
    writerRef.current?.quiz();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={divRef} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white" onClick={animate} />
      <div className="flex gap-2">
        <button 
          onClick={animate}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm"
        >
          Animate
        </button>
        <button 
          onClick={quiz}
          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
        >
          Quiz
        </button>
      </div>
    </div>
  );
};

export default HanziWriterComponent;
