export default function PokemonImage({ src, alt, hovered }) {
  return (
    <div
      className={`relative h-32 flex items-center justify-center transition-transform duration-300 ${
        hovered ? '-translate-y-2' : ''
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`max-h-full max-w-full object-contain transition-all duration-300 ${
          hovered ? 'scale-110' : 'scale-100'
        }`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/pokeball.png';
        }}
      />
    </div>
  );
}
