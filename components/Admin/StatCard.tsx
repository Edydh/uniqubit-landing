import { FC } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className="text-gray-500">{icon}</div>
      </div>
      <div className="mt-2">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {change && (
          <p className={`text-xs mt-1 ${changeColor}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
