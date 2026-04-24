import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ activeTab }) => {
    
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Left Side: Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search students, logs, reports..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 transition-all text-sm" 
        />
      </div>

      {/* Right Side: Profile & Notifications */}
      <div className="flex items-center gap-5">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-5 ml-2">
          <div className="text-right">
            <p className="text-sm font-bold text-deepNavy leading-tight">Admin Panel</p>
            <p className="text-[10px] text-primaryBlue font-black uppercase tracking-tighter">
              {activeTab} Mode
            </p>
          </div>
          <div className="w-10 h-10 bg-deepNavy rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-primaryBlue/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;