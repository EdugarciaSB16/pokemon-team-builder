import { forwardRef } from 'react';

const TeamSlotWrapper = forwardRef(function TeamSlotWrapper(
  { children, className = '' },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center justify-end bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border-2 border-yellow-400 transform transition-all hover:shadow-yellow-400/30 hover:z-10 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
});

export default TeamSlotWrapper;
