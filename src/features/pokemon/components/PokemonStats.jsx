export default function PokemonStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-3">
      {stats.slice(0, 4).map((stat, index) => (
        <div key={index} className="text-left">
          <div className="flex justify-between mb-0.5">
            <span className="text-gray-600 font-medium">{stat.stat.name}</span>
            <span className="font-bold">{stat.base_stat}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-full rounded-full ${
                stat.base_stat > 70
                  ? 'bg-green-500'
                  : stat.base_stat > 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min(100, (stat.base_stat / 150) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
