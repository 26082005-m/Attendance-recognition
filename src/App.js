import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import StudentManagement from './pages/StudentManagement';
import AttendanceLogs from './pages/AttendanceLogs';
import Reports from './pages/Reports';
import ClassSection from './pages/ClassSection';
import Camera from './pages/Camera';
import Settings from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Theme State: 'light', 'dark', 'night'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Jab bhi theme badle, usey save karein
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Theme Base Classes
  const themeClasses = {
    light: "bg-[#f8faff] text-slate-900",
    dark: "bg-[#1e293b] text-white",
    night: "bg-black text-gray-300"
  };

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${themeClasses[theme]}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} theme={theme} />
        
        <main className="p-8 overflow-y-auto flex-1">
          {/* Har page ko theme prop bhej rahe hain */}
          {activeTab === 'Overview' && <Overview theme={theme} />}
          {activeTab === 'Student Management' && <StudentManagement theme={theme} />}
          {activeTab === 'Attendance Logs' && <AttendanceLogs theme={theme} />}
          {activeTab === 'Reports' && <Reports theme={theme} />}
          {activeTab === 'Class/Section' && <ClassSection theme={theme} />}
          {activeTab === 'Camera' && <Camera theme={theme} />}
          {activeTab === 'Settings' && <Settings theme={theme} setTheme={setTheme} />}
        </main>
      </div>
    </div>
  );
}

export default App;