"use client";
import React, { useState, useEffect } from "react";
import { viewSchedule, createSchedule } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";

const ViewSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userRole = user ? user.role : "guest";

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  const loadSchedules = async () => {
    try {
      const response = await viewSchedule();
      setSchedules(response?.data || []);
    } catch (err) {
      setError("Failed to fetch schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleViewClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All House Schedules</h2>
        {(userRole === "admin" || userRole === "projectmanager") && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-all"
          >
            <FaPlus /> Add Schedule
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading schedules...</p>}
      {!loading && !error && schedules.length === 0 && (
        <p>No schedules found.</p>
      )}

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule._id}
            className="flex items-center justify-between border-b py-2 px-4 rounded bg-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center md:gap-10 w-full">
              <p className="font-medium text-sm">
                <strong>Site:</strong> {schedule.siteLocation}
              </p>
              <p className="font-medium text-sm">
                <strong>Purpose:</strong> {schedule.purpose}
              </p>
            </div>
            <button
              onClick={() => handleViewClick(schedule)}
              className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] md:w-[40%] max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Schedule Details</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p><strong>Site Location:</strong> {selectedSchedule.siteLocation}</p>
              <p><strong>Purpose:</strong> {selectedSchedule.purpose}</p>
              <p><strong>House Type:</strong> {selectedSchedule.houseType}</p>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Material Name</th>
                  <th className="py-2 px-4 border">Max Quantity</th>
                  <th className="py-2 px-4 border">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedSchedule.materials.map((mat, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-4 border">{mat.materialName}</td>
                    <td className="py-2 px-4 border">{mat.maxQuantity}</td>
                    <td className="py-2 px-4 border">{mat.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-gray-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSchedules;
