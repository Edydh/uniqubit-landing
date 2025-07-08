import StatCard from './StatCard';
import ProjectList from './ProjectList';
import { HiUserGroup, HiOutlineClipboardList, HiLightningBolt, HiChartBar } from 'react-icons/hi';

const AdminDashboard = () => {
  // Mock metric data
  const metrics = [
    {
      title: 'Total Clients',
      value: '24',
      icon: <HiUserGroup className="w-6 h-6" />,
      change: '+3 this month',
      changeType: 'increase' as const,
    },
    {
      title: 'Active Projects',
      value: '8',
      icon: <HiOutlineClipboardList className="w-6 h-6" />,
      change: '+1 this week',
      changeType: 'increase' as const,
    },
    {
      title: 'AI Insights',
      value: '12',
      icon: <HiLightningBolt className="w-6 h-6" />,
      change: '+4 new',
      changeType: 'increase' as const,
    },
    {
      title: 'Leads Analyzed',
      value: '57',
      icon: <HiChartBar className="w-6 h-6" />,
      change: '+7 this month',
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 text-lg">Command center for managing clients, projects, and AI insights.</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </section>
      <section>
        <ProjectList />
      </section>
    </div>
  );
};

export default AdminDashboard;
