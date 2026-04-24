import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const events = [
  {
    time: '10:30 AM',
    title: 'Mathematics - Section A',
    room: 'Room 204',
    status: 'Ongoing',
  },
  {
    time: '12:00 PM',
    title: 'Physics Lab - Section B',
    room: 'Lab 02',
    status: 'Upcoming',
  },
  {
    time: '02:30 PM',
    title: 'Staff Meeting',
    room: 'Conference Hall',
    status: 'Upcoming',
  },
];

const UpcomingEvents = () => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition group">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              event.status === 'Ongoing' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-gray-100 text-gray-500'
            }`}>
              {event.status}
            </span>
            <span className="text-xs font-bold text-primaryBlue">{event.time}</span>
          </div>
          <h4 className="font-bold text-deepNavy group-hover:text-primaryBlue transition-colors">
            {event.title}
          </h4>
          <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
            <MapPin size={12} />
            <span>{event.room}</span>
          </div>
        </div>
      ))}
      <button className="w-full py-3 mt-2 text-sm font-bold text-primaryBlue bg-blue-50 rounded-xl hover:bg-primaryBlue hover:text-white transition">
        View Full Schedule
      </button>
    </div>
  );
};

export default UpcomingEvents;