const AttendanceTable = () => {
  const logs = [
    { id: '101', name: 'Aman Verma', class: '10-A', time: '08:30 AM', status: 'Recognized' },
    { id: '102', name: 'Sneha Rao', class: '12-B', time: '08:35 AM', status: 'Manual' },
    { id: '103', name: 'Rahul Roy', class: '10-A', time: '08:42 AM', status: 'Recognized' },
    { id: '104', name: 'Unknown', class: 'N/A', time: '09:00 AM', status: 'Alert' },
  ];

  return (
    <table className="w-full">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th className="px-6 py-4 text-left">Student</th>
          <th className="px-6 py-4 text-left">Class</th>
          <th className="px-6 py-4 text-left">Time In</th>
          <th className="px-6 py-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {logs.map((log, i) => (
          <tr key={i} className="hover:bg-blue-50/30 transition">
            <td className="px-6 py-4">
              <div className="font-bold text-deepNavy">{log.name}</div>
              <div className="text-xs text-gray-400">ID: {log.id}</div>
            </td>
            <td className="px-6 py-4 text-gray-600 font-medium">{log.class}</td>
            <td className="px-6 py-4 text-gray-600">{log.time}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                log.status === 'Recognized' ? 'bg-green-100 text-green-700' : 
                log.status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {log.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default AttendanceTable;