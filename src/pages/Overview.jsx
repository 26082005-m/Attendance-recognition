import React from 'react';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import ClassDistribution from '../components/ClassDistribution';
import AttendanceTable from '../components/AttendanceTable';
import UpcomingEvents from '../components/UpcomingEvents';

const Overview = () => (

    

    
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Students" value="500" trend="+2%" icon="users" color="bg-primaryBlue" />
      <StatCard title="Present Today" value="420" trend="84%" icon="check" color="bg-sky-400" />
      <StatCard title="Absent Today" value="80" trend="16%" icon="x" color="bg-gray-400" />
      <StatCard title="Late Arrivals" value="15" trend="3%" icon="clock" color="bg-indigo-900" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">Weekly Attendance Trend (%)</h3>
        <AttendanceChart />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">Class Distribution</h3>
        <ClassDistribution />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <AttendanceTable />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <UpcomingEvents />
      </div>
    </div>
  </div>
);
export default Overview;