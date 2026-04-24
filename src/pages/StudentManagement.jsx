import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, User } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState(JSON.parse(localStorage.getItem('registered_students')) || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', roll: '', class: '', photo: null });

  useEffect(() => {
    localStorage.setItem('registered_students', JSON.stringify(students));
  }, [students]);

  // Photo ko Base64 mein convert karne ka function
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
    } else {
      setStudents([...students, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
    setFormData({ name: '', roll: '', class: '', photo: null });
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this student?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
        <h2 className="text-2xl font-black text-deepNavy">Student Registration</h2>
        <button onClick={() => { setEditingStudent(null); setIsModalOpen(true); }} className="bg-primaryBlue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20} /> Register New Student
        </button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-[10px] uppercase font-black text-gray-400">
              <th className="p-6">Profile</th>
              <th className="p-6">Student Name</th>
              <th className="p-6">Roll No</th>
              <th className="p-6">Class</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 px-6">
                  {s.photo ? (
                    <img src={s.photo} className="w-12 h-12 rounded-full object-cover border-2 border-primaryBlue/20" alt="profile" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User /></div>
                  )}
                </td>
                <td className="p-6 font-bold text-deepNavy">{s.name}</td>
                <td className="p-6 text-gray-600 font-medium">{s.roll}</td>
                <td className="p-6 text-gray-600 font-medium">{s.class}</td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => { setEditingStudent(s); setFormData(s); setIsModalOpen(true); }} className="text-primaryBlue p-2 bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 p-2 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-deepNavy uppercase italic">
              {editingStudent ? 'Edit Details' : 'Registration Form'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload Box */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-primaryBlue/30 flex items-center justify-center overflow-hidden">
                    {formData.photo ? (
                      <img src={formData.photo} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <Upload className="text-gray-300" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Profile Photo</p>
              </div>

              <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Roll No" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} required />
                <input type="text" placeholder="Class" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 border rounded-2xl font-bold text-gray-500">Cancel</button>
                <button type="submit" className="flex-1 p-4 bg-primaryBlue text-white rounded-2xl font-bold">Save Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;