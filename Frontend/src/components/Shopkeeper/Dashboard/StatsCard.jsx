const StatsCard = ({ title, value, subtext, icon, color, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-gray-500 text-sm h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></p>
            <h2 className="text-3xl font-bold h-8 bg-gray-200 rounded w-20 animate-pulse"></h2>
            {subtext && <p className="text-gray-500 text-xs mt-2 h-3 bg-gray-100 rounded w-16 animate-pulse"></p>}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 animate-pulse`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">{value}</h2>
          {subtext && <p className="text-gray-500 text-xs mt-2">{subtext}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;