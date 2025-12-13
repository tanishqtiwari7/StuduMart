// UI Only — Statistics card component for admin dashboard

const StatsCard = ({ title, value, change, icon, gradient }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
