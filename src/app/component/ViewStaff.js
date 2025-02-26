"use client";
import React, { useState, useEffect } from "react";
import { viewAllStaff, editStaff, deleteStaff } from "../utils/Apis";
import { FiEdit, FiTrash } from "react-icons/fi";

const ViewStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isVerified: false,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await viewAllStaff();
        setStaffList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      isVerified: staff.isVerified,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        setStaffList(staffList.filter((staff) => staff._id !== id));
      } catch (err) {
        console.error("Error deleting staff:", err);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedStaff = await editStaff(selectedStaff._id, formData);
      setStaffList(
        staffList.map((staff) => (staff._id === selectedStaff._id ? updatedStaff.staff : staff))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating staff:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && staffList.length === 0 && (
        <p>There are no staff members available at this time.</p>
      )}
      <div className="w-[90%]">
        <p className="font-bold text-2xl mb-6">View All Existing Staff</p>
        <section className="flex flex-col gap-4">
          {staffList.map((staff) => (
            <div key={staff._id} className="flex gap-4 items-center border rounded-md py-2 px-4 justify-between">
              <div className="flex gap-4">
                <p>{staff.name}</p>
                <p>{staff.role}</p>
                <p>{staff.email}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEditClick(staff)} className="text-blue-500">
                  <FiEdit size={20} />
                </button>
                <button onClick={() => handleDeleteClick(staff._id)} className="text-red-500">
                  <FiTrash size={20} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border p-2 rounded" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="border p-2 rounded" />
              <select name="role" value={formData.role} onChange={handleInputChange} className="border p-2 rounded">
                <option value="admin">Admin</option>
                <option value="storekeepers">Storekeeper</option>
                <option value="engineers">Engineer</option>
              </select>
              <label>
                <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} />
                Verified
              </label>
              <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStaff;
