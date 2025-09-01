"use client";
import React, { useState, useEffect } from "react";
import { viewSchedule, createSchedule } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";
import { categories, locations } from "../data/data"; // Assuming these are available for the form

const ViewSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    siteLocation: "",
    purpose: "",
    houseType: "",
    materials: [{ materialName: "", maxQuantity: "", unit: "" }],
  });
  const [notification, setNotification] = useState({ message: "", type: "" });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userRole = user ? user.role : "guest";

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadSchedules = async () => {
    setLoading(true);
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

  const handleAddMaterial = () => {
    setNewSchedule({
      ...newSchedule,
      materials: [...newSchedule.materials, { materialName: "", maxQuantity: "", unit: "" }],
    });
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...newSchedule.materials];
    updatedMaterials[index][field] = field === "maxQuantity" ? parseFloat(value) || "" : value;

    if (field === "materialName") {
      const selectedCategory = categories.find((cat) => cat.materials.some((mat) => mat.name === value));
      updatedMaterials[index].unit = selectedCategory?.materials.find((mat) => mat.name === value)?.unit || "";
    }

    setNewSchedule({ ...newSchedule, materials: updatedMaterials });
  };

  const handleRemoveMaterial = (index) => {
    setNewSchedule({
      ...newSchedule,
      materials: newSchedule.materials.filter((_, i) => i !== index),
    });
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    const { siteLocation, purpose, houseType, materials } = newSchedule;

    if (!siteLocation || !purpose || !houseType || materials.some((mat) => !mat.materialName || !mat.maxQuantity)) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    try {
      await createSchedule(newSchedule);
      setNotification({ message: "Schedule added successfully!", type: "success" });
      setNewSchedule({
        siteLocation: "",
        purpose: "",
        houseType: "",
        materials: [{ materialName: "", maxQuantity: "", unit: "" }],
      });
      setShowAddForm(false);
      loadSchedules();
    } catch (err) {
      setNotification({ message: "Failed to add schedule.", type: "error" });
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#123962]">All House Schedules</h2>
          {(userRole === "admin" || userRole === "projectManager") && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
            >
              <FaPlus /> Add Schedule
            </button>
          )}
        </div>

        {loading && <p className="text-center text-gray-600">Loading schedules...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && schedules.length === 0 && (
          <p className="text-center text-gray-600">No schedules found.</p>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="space-y-4">
            {/* Desktop List */}
            <div className="hidden sm:block">
              {schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="flex items-center justify-between p-4 border-b rounded-md bg-white shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-4 w-full text-sm">
                    <p>
                      <span className="font-medium">Site:</span> {schedule.siteLocation}
                    </p>
                    <p>
                      <span className="font-medium">Purpose:</span> {schedule.purpose}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewClick(schedule)}
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                >
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Site:</span> {schedule.siteLocation}
                    </p>
                    <p>
                      <span className="font-medium">Purpose:</span> {schedule.purpose}
                    </p>
                    <div className="text-right">
                      <button
                        onClick={() => handleViewClick(schedule)}
                        className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#123962]">Add New Schedule</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleAddSchedule} className="space-y-6">
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Site Location</label>
                    <select
                      value={newSchedule.siteLocation}
                      onChange={(e) => setNewSchedule({ ...newSchedule, siteLocation: e.target.value, houseType: "" })}
                      className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    >
                      <option value="">Select a Site Location</option>
                      {locations.map((site, index) => (
                        <option key={index} value={site.name}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">House Type</label>
                    <select
                      value={newSchedule.houseType}
                      onChange={(e) => setNewSchedule({ ...newSchedule, houseType: e.target.value })}
                      className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      disabled={!newSchedule.siteLocation}
                    >
                      <option value="">Select a House Type</option>
                      {locations
                        .find((site) => site.name === newSchedule.siteLocation)
                        ?.houseTypes.map((house, index) => (
                          <option key={index} value={house.type}>
                            {house.type}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Purpose</label>
                    <input
                      type="text"
                      value={newSchedule.purpose}
                      onChange={(e) => setNewSchedule({ ...newSchedule, purpose: e.target.value })}
                      className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Materials</h4>
                  {newSchedule.materials.map((material, index) => (
                    <div key={index} className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Material Name</label>
                        <select
                          value={material.materialName}
                          onChange={(e) => handleMaterialChange(index, "materialName", e.target.value)}
                          className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        >
                          <option value="">Select a Material</option>
                          {categories.flatMap((cat) => cat.materials).map((mat, idx) => (
                            <option key={idx} value={mat.name}>
                              {mat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Max Quantity</label>
                        <input
                          type="number"
                          value={material.maxQuantity}
                          onChange={(e) => handleMaterialChange(index, "maxQuantity", e.target.value)}
                          className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                        <input
                          type="text"
                          value={material.unit}
                          className="border border-gray-300 p-2 rounded-md w-full text-sm bg-gray-100 focus:outline-none"
                          readOnly
                        />
                        {newSchedule.materials.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="text-red-600 hover:text-red-800 text-sm mt-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add Material
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Details Modal */}
        {isModalOpen && selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#123962]">Schedule Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 text-sm mb-4">
                <div>
                  <p>
                    <span className="font-medium">Site Location:</span> {selectedSchedule.siteLocation}
                  </p>
                  <p>
                    <span className="font-medium">Purpose:</span> {selectedSchedule.purpose}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">House Type:</span> {selectedSchedule.houseType}
                  </p>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-semibold mb-2">Materials</h4>
              {/* Desktop Materials Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-4 border-b">Material Name</th>
                      <th className="py-2 px-4 border-b">Max Quantity</th>
                      <th className="py-2 px-4 border-b">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSchedule.materials.map((mat, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-2 px-4">{mat.materialName}</td>
                        <td className="py-2 px-4">{mat.maxQuantity}</td>
                        <td className="py-2 px-4">{mat.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Materials Card Layout */}
              <div className="sm:hidden space-y-4">
                {selectedSchedule.materials.map((mat, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Material Name:</span> {mat.materialName}
                      </p>
                      <p>
                        <span className="font-medium">Max Quantity:</span> {mat.maxQuantity}
                      </p>
                      <p>
                        <span className="font-medium">Unit:</span> {mat.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSchedules;