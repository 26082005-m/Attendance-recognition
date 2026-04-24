import React from 'react';
import { Sun, Moon, Zap, Monitor } from 'lucide-react';

const Settings = ({ theme, setTheme }) => {
  
  // Theme Options Data
  const themeOptions = [
    { 
      id: 'light', 
      name: 'Light Mode', 
      icon: Sun, 
      color: 'bg-white', 
      text: 'text-gray-800', 
      border: 'border-gray-200',
      desc: 'Classic bright look'
    },
    { 
      id: 'dark', 
      name: 'Dark Mode', 
      icon: Moon, 
      color: 'bg-slate-800', 
      text: 'text-white', 
      border: 'border-slate-700',
      desc: 'Comfortable navy dark'
    },
    { 
      id: 'night', 
      name: 'Night Mode', 
      icon: Zap, 
      color: 'bg-black', 
      text: 'text-gray-400', 
      border: 'border-gray-800',
      desc: 'Pure black experience'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Heading Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primaryBlue/10 rounded-lg">
          <Monitor className="text-primaryBlue" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Appearance Settings</h2>
          <p className="text-sm opacity-50">Customize how your dashboard looks and feels</p>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {themeOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`relative overflow-hidden group p-1 rounded-3xl border-[3px] transition-all duration-300 ${
              theme === opt.id 
                ? 'border-primaryBlue scale-105 shadow-2xl shadow-primaryBlue/20' 
                : 'border-transparent hover:border-gray-300 shadow-sm'
            }`}
          >
            <div className={`${opt.color} ${opt.text} p-8 rounded-[22px] text-left h-48 flex flex-col justify-between border ${opt.border}`}>
              
              <div className="flex justify-between items-start">
                <opt.icon 
                  size={32} 
                  className={theme === opt.id ? 'text-primaryBlue' : 'opacity-40'} 
                />
                {theme === opt.id && (
                  <span className="bg-primaryBlue text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                    Active
                  </span>
                )}
              </div>

              <div>
                <p className="font-bold text-xl mb-1">{opt.name}</p>
                <p className="text-xs opacity-50 font-medium">{opt.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Settings;