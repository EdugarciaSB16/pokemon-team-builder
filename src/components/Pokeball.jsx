export default function Pokeball({ size = 32 }) {
  const dimension = `${size}px`;

  return (
    <div
      className="relative rounded-full border-2 border-gray-800 bg-white overflow-hidden shadow-inner"
      style={{ width: dimension, height: dimension }}
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500"></div>
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>
      <div
        className="absolute top-1/2 left-1/2 bg-white border-2 border-gray-800 rounded-full shadow-sm"
        style={{
          width: size / 2.5,
          height: size / 2.5,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
    </div>
  );
}
