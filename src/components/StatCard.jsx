import React from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const iconMap = {
  users: Users,
  check: CheckCircle,
  x: XCircle,
  clock: Clock,
};

const StatCard = ({ title, value, trend, icon, color }) => {
  const IconComponent = iconMap[icon];
  

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:scale-[1.02] cursor-default">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl font-bold text-deepNavy">{value}</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            title.includes('Absent') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {trend}
          </span>
        </div>
      </div>
      <div className={`${color} p-4 rounded-xl text-white shadow-lg`}>
        {IconComponent && <IconComponent size={24} />}
      </div>
    </div>
  );
};

export default StatCard;