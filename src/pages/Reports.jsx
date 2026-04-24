import React from 'react';
import AttendanceChart from '../components/AttendanceChart'; // Check karein ye path sahi hai
import { Download, FileText, BarChart } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Top Stats for Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Avg. Attendance</p>
          <h3 className="text-2xl font-bold text-deepNavy">92.4%</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Best Performing Class</p>
          <h3 className="text-2xl font-bold text-primaryBlue">Grade 10-A</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Alerts</p>
          <h3 className="text-2xl font-bold text-red-500">12</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart size={20} className="text-primaryBlue" /> 
            Monthly Growth
          </h3>
          <AttendanceChart />
        </div>

        {/* Download Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Generated Reports</h3>
          <div className="space-y-4">
            {[
              { name: 'Weekly Attendance Sheet', type: 'Excel', date: 'Oct 20, 2023' },
              { name: 'Monthly Performance PDF', type: 'PDF', date: 'Oct 01, 2023' },
              { name: 'Student Recognition Logs', type: 'CSV', date: 'Sep 28, 2023' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-primaryBlue rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-deepNavy">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.date} • {item.type}</p>
                  </div>
                </div>
                <button className="text-primaryBlue hover:bg-primaryBlue hover:text-white p-2 rounded-lg transition">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; // <--- YE LINE HONI HI CHAHIYE