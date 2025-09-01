"use client";
import React, { useState, useEffect } from "react";
import { viewAllStaff, editStaff, deleteStaff } from "../utils/Apis";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

const ViewStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isVerified: false,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
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

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        setStaffList(staffList.filter((staff) => staff._id !== id));
        setNotification({ message: "Staff member deleted successfully!", type: "success" });
      } catch (err) {
        setNotification({ message: "Failed to delete staff member.", type: "error" });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }
    try {
      const updatedStaff = await editStaff(selectedStaff._id, formData);
      setStaffList(
        staffList.map((staff) => (staff._id === selectedStaff._id ? updatedStaff.staff : staff))
      );
      setNotification({ message: "Staff member updated successfully!", type: "success" });
      setIsModalOpen(false);
    } catch (err) {
      setNotification({ message: "Failed to update staff member.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.message && (
          <div
            className={`fixed z-50 top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[#123962]">View All Existing Staff</h1>

        {loading && <p className="text-center text-gray-600">Loading staff...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && staffList.length === 0 && (
          <p className="text-center text-gray-600">No staff members available at this time.</p>
        )}

        {!loading && !error && staffList.length > 0 && (
          <div className="space-y-4">
            {/* Desktop List */}
            <div className="hidden sm:block">
              {staffList.map((staff) => (
                <div
                  key={staff._id}
                  className="flex items-center justify-between p-4 border-b rounded-md bg-white shadow-sm"
                >
                  <div className="grid grid-cols-3 gap-4 w-full text-sm">
                    <p>{staff.name}</p>
                    <p className="capitalize">{staff.role}</p>
                    <p>{staff.email}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEditClick(staff)}
                      className="text-[#123962] hover:text-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(staff._id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {staffList.map((staff) => (
                <div
                  key={staff._id}
                  className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                >
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {staff.name}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span> {staff.role}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {staff.email}
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => handleEditClick(staff)}
                        className="text-[#123962] hover:text-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(staff._id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <FiTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Staff Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#123962]">Edit Staff</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                  >
                    <option value="">Select a Role</option>
                    <option value="admin">Admin</option>
                    <option value="storekeepers">Storekeeper</option>
                    <option value="engineers">Engineer</option>
                    <option value="projectManager">Project Manager</option>
                    <option value="projectEngineer">Project Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#123962] focus:ring-[#123962]"
                    />
                    Verified
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStaff;