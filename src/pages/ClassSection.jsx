import React, { useState } from 'react';
import { Users, BookOpen, ArrowLeft, GraduationCap, Search, Calendar } from 'lucide-react';

const ClassSection = () => {
  // 1. State: Konsi class select hui hai (null matlab grid view dikhayega)
  const [selectedClass, setSelectedClass] = useState(null);

  // 2. Mock Data for Classes
  const classes = [
    { id: 1, name: '10-A', teacher: 'Mr. Rajesh Sharma', count: 45 },
    { id: 2, name: '10-B', teacher: 'Ms. Priya Verma', count: 42 },
    { id: 3, name: '11-A', teacher: 'Dr. Amit Kumar', count: 38 },
    { id: 4, name: '11-B', teacher: 'Mrs. Suman Lata', count: 40 },
    { id: 5, name: '12-A', teacher: 'Mr. Vikram Singh', count: 35 },
    { id: 6, name: '12-B', teacher: 'Ms. Anjali Rao', count: 37 },
  ];

  // 3. Mock Data for Students (Class-wise)
  const studentsData = {
    '10-A': [
      { id: 1, name: 'Arjun Singh', roll: '101', status: 'Present' },
      { id: 2, name: 'Neha Gupta', roll: '102', status: 'Absent' },
      { id: 3, name: 'Rahul Roy', roll: '103', status: 'Present' },
    ],
    '12-B': [
      { id: 1, name: 'Sara Khan', roll: '501', status: 'Present' },
      { id: 2, name: 'Aman Deep', roll: '502', status: 'Present' },
    ]
  };

  // --- VIEW 1: CLASS GRID VIEW ---
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {classes.map((cls) => (
        <div 
          key={cls.id} 
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primaryBlue/20 transition-all group cursor-default"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-primaryBlue/10 text-primaryBlue rounded-2xl group-hover:bg-primaryBlue group-hover:text-white transition-colors">
              <BookOpen size={28} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</p>
              <h3 className="text-2xl font-black text-deepNavy uppercase">{cls.name}</h3>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-500">
              <GraduationCap size={16} />
              <span className="text-sm font-medium">{cls.teacher}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={16} />
              <span className="text-sm font-bold">{cls.count} Students Enrolled</span>
            </div>
          </div>

          <button 
            onClick={() => setSelectedClass(cls.name)}
            className="w-full py-3 bg-gray-50 text-primaryBlue font-bold rounded-xl hover:bg-primaryBlue hover:text-white transition-all active:scale-95 shadow-sm"
          >
            View Student List
          </button>
        </div>
      ))}
    </div>
  );

  // --- VIEW 2: STUDENT LIST VIEW (Working) ---
  const renderListView = () => {
    const students = studentsData[selectedClass] || [];

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Back Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
          <button 
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-primaryBlue font-bold transition"
          >
            <ArrowLeft size={20} /> Back to Classes
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-deepNavy">CLASS {selectedClass}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Student Directory</p>
          </div>
          <button className="bg-primaryBlue/10 text-primaryBlue p-2 rounded-lg">
            <Search size={20} />
          </button>
        </div>

        {/* List Table */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Roll No</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Student Name</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Current Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-8 py-4 font-mono font-bold text-primaryBlue">{stu.roll}</td>
                    <td className="px-8 py-4 font-bold text-deepNavy">{stu.name}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        stu.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stu.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-xs font-bold text-gray-400 hover:text-primaryBlue">Profile</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-gray-400 italic">
                    No student records found for this class in current session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dynamic Heading */}
      {!selectedClass && (
        <div className="mb-8">
          <h1 className="text-3xl font-black text-deepNavy uppercase tracking-tight">Classes & Sections</h1>
          <p className="text-gray-500 mt-1">Select a class to manage students and view attendance.</p>
        </div>
      )}

      {/* Logic to Switch Views */}
      {selectedClass ? renderListView() : renderGridView()}
    </div>
  );
};

export default ClassSection;