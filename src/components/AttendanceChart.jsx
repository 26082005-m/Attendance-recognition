import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = [{d: 'Mon', p: 85}, {d: 'Tue', p: 92}, {d: 'Wed', p: 88}, {d: 'Thu', p: 95}, {d: 'Fri', p: 90}];

const AttendanceChart = () => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="d" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Line type="monotone" dataKey="p" stroke="#0056b3" strokeWidth={4} dot={{ r: 6, fill: '#0056b3' }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default AttendanceChart;