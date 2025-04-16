"use client";
import React, { useState, useEffect } from "react";
import { viewSchedule, createSchedule } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";

const ViewRequest = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    houseType: "",
    purpose: "",
    siteLocation: "",
    materials: [],
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userRole = user ? user.role : "guest";

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await viewSchedule();
        setSchedules(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };
    loadSchedules();
  }, []);

  const handleAddSchedule = async () => {
    try {
      await createSchedule(newSchedule);
      setShowAddForm(false);
      setNewSchedule({
        houseType: "",
        purpose: "",
        siteLocation: "",
        materials: [],
      });
      const updatedData = await viewSchedule();
      setSchedules(updatedData.data || []);
    } catch (err) {
      console.error("Failed to create schedule:", err);
    }
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

      {schedules.map((schedule) => (
        <div
          key={schedule._id}
          className="mb-4 p-4 border rounded shadow-sm bg-gray-50"
        >
          <h3 className="font-semibold text-md mb-2">{schedule.purpose}</h3>
          <p><strong>House Type:</strong> {schedule.houseType}</p>
          <p><strong>Location:</strong> {schedule.siteLocation}</p>
          <div className="mt-2">
            <p className="font-semibold">Materials:</p>
            <ul className="list-disc list-inside text-sm">
              {schedule.materials.map((mat, idx) => (
                <li key={idx}>
                  {mat.materialName} - {mat.maxQuantity} {mat.unit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {showAddForm && (
        <div className="mt-6 border p-4 rounded shadow-md bg-white">
          <h3 className="text-lg font-bold mb-4">New Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="House Type"
              value={newSchedule.houseType}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, houseType: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Purpose"
              value={newSchedule.purpose}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, purpose: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Site Location"
              value={newSchedule.siteLocation}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, siteLocation: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>

          {/* Optionally add a material entry section here */}

          <button
            onClick={handleAddSchedule}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewRequest;
