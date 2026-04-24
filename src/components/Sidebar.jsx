import { LayoutDashboard, Users, ClipboardList, BarChart3, School, Settings, Camera } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Student Management', icon: Users },
    { name: 'Attendance Logs', icon: ClipboardList },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Class/Section', icon: School },
    { name: 'Camera', icon: Camera },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-72 bg-deepNavy text-white flex flex-col shrink-0">
      <div className="p-8 text-2xl font-black tracking-tighter border-b border-gray-800">
        EDU<span className="text-primaryBlue">RECOG</span>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
              activeTab === item.name ? 'bg-primaryBlue shadow-lg shadow-blue-900/50' : 'hover:bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;