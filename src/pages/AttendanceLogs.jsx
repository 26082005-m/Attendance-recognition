import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar as CalendarIcon, UserCheck, AlertTriangle } from 'lucide-react';

const AttendanceLogs = () => {
  // 1. Static Mock Data
  const [staticLogs] = useState([
    { id: '1', name: 'Arjun Sharma', roll: '101', class: '10-A', time: '08:30 AM', date: '2023-10-25', status: 'Recognized' },
    { id: '2', name: 'Priya Patel', roll: '102', class: '12-B', time: '08:45 AM', date: '2023-10-25', status: 'Manual' },
    { id: '3', name: 'Rahul Verma', roll: '103', class: '11-C', time: '09:05 AM', date: '2023-10-24', status: 'Recognized' },
    { id: '4', name: 'Sneha Rao', roll: '104', class: '10-A', time: '08:35 AM', date: '2023-10-24', status: 'Recognized' },
    { id: '5', name: 'Unknown', roll: 'N/A', class: 'N/A', time: '10:15 AM', date: '2023-10-25', status: 'Alert' },
    { id: '6', name: 'Amit Singh', roll: '105', class: '12-B', time: '08:50 AM', date: '2023-10-23', status: 'Recognized' },
  ]);

  // 2. Filter States
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [dateFilter, setDateFilter] = useState(''); 
  const [classFilter, setClassFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Combined Filter Logic (Live Data + Static Data + Filters)
  useEffect(() => {
    const applyFilters = () => {
      // Step A: LocalStorage se Live data uthao
      const rawLiveLogs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
      
      // Live logs ko format karo taaki filtering sahi se ho
      const liveLogs = rawLiveLogs.map(log => ({
        ...log,
        id: log.id || Math.random().toString(),
        date: log.date || new Date().toISOString().split('T')[0], // Aaj ki date agar missing ho
        status: log.status || 'Recognized',
        roll: log.id // Camera simulation mein id hi roll hai
      }));

      // Step B: Dono lists ko merge karo (Live data upar dikhega)
      let combined = [...liveLogs, ...staticLogs];

      // Step C: Search Filter apply karo
      if (searchTerm) {
        combined = combined.filter(log => 
          log.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          log.roll.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Step D: Date Filter apply karo
      if (dateFilter) {
        combined = combined.filter(log => log.date === dateFilter);
      }

      // Step E: Class Filter apply karo
      if (classFilter !== 'All') {
        combined = combined.filter(log => log.class === classFilter);
      }

      setFilteredLogs(combined);
    };

    // Pehli baar run karo
    applyFilters();

    // Har 2 second mein check karo agar Camera se naya data aaya hai
    const interval = setInterval(applyFilters, 2000); 
    return () => clearInterval(interval);

  }, [searchTerm, dateFilter, classFilter, staticLogs]);

  // 4. Reset Logic
  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setClassFilter('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- FILTER BAR --- */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primaryBlue transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Picker (DD-MM-YYYY HTML input handled automatically) */}
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="date" 
              className="pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primaryBlue transition text-sm font-medium"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
            <select 
              className="pl-10 pr-10 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primaryBlue transition text-sm font-medium appearance-none cursor-pointer"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All">All Classes</option>
              <option value="10-A">10-A</option>
              <option value="11-C">11-C</option>
              <option value="12-B">12-B</option>
            </select>
          </div>

          <button onClick={resetFilters} className="text-sm font-bold text-red-400 hover:text-red-600 px-2 transition">
            Reset
          </button>

          <button className="ml-auto bg-primaryBlue text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition font-bold text-sm shadow-lg shadow-blue-500/20">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-deepNavy uppercase tracking-wider text-sm">Attendance History</h3>
          <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black animate-pulse">
            LIVE SYNC ACTIVE
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black border-b">
            <tr>
              <th className="p-6">Student</th>
              <th className="p-6">Class</th>
              <th className="p-6">Date</th>
              <th className="p-6">Time In</th>
              <th className="p-6">Method</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primaryBlue/10 text-primaryBlue rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                      {log.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-deepNavy text-sm">{log.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {log.roll}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm font-medium text-gray-600">{log.class}</td>
                <td className="p-6 text-sm text-gray-500 font-medium">
                   {new Date(log.date).toLocaleDateString('en-GB')} 
                </td>
                <td className="p-6 text-sm font-bold text-deepNavy">{log.time}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    log.status === 'Recognized' ? 'bg-green-100 text-green-700' : 
                    log.status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.status === 'Alert' && <AlertTriangle size={10} className="inline mr-1" />}
                    {log.status}
                  </span>
                </td>
                <td className="p-6">
                  <button className="text-primaryBlue text-xs font-bold hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            No matching records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceLogs;