"use client";
import React, { useState, useEffect } from "react";
import { sites, categories } from "../data/data";
import { sendMat } from "../utils/Apis";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../libs/features/authSlice";

const TransferMat = ({ toggleForm }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    fromSite: "",
    toSite: "",
    createdBy: userInfo?.name || "",
    date: new Date().toISOString().split("T")[0], // Add date field
    materials: [],
  });

  const [materialInput, setMaterialInput] = useState({
    category: "",
    materialName: "",
    quantity: "",
    unit: "",
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user if not available
  useEffect(() => {
    if (!userInfo) {
      dispatch(loadUser());
    }
  }, [userInfo, dispatch]);

  // Update form creator when user is loaded
  useEffect(() => {
    if (userInfo?.name) {
      setFormData((prev) => ({ ...prev, createdBy: userInfo.name }));
    }
  }, [userInfo]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fromSite" || name === "toSite") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      const updatedMaterialInput = { ...materialInput, [name]: value };

      if (name === "category") {
        updatedMaterialInput.materialName = "";
        updatedMaterialInput.unit = "";
      }

      if (name === "materialName") {
        const selectedCategory = categories.find(cat => cat.name === materialInput.category);
        const selectedMaterial = selectedCategory?.materials.find(mat => mat.name === value);
        updatedMaterialInput.unit = selectedMaterial?.unit || "";
      }

      setMaterialInput(updatedMaterialInput);
    }
  };

  const addMaterial = () => {
    const { materialName, quantity } = materialInput;

    if (!materialName.trim() || !quantity) {
      setNotification({
        message: "Please fill in material name and quantity",
        type: "error",
      });
      return;
    }

    const newMaterial = {
      category: materialInput.category,
      materialName: materialInput.materialName,
      quantity: parseFloat(materialInput.quantity) || 0,
      unit: materialInput.unit,
    };

    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));

    setMaterialInput({ category: "", materialName: "", quantity: "", unit: "" });
  };

  const removeMaterial = (index) => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index][field] = field === "quantity" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fromSite, toSite, materials, createdBy } = formData;

    if (fromSite === toSite) {
      setNotification({ message: "Source and destination sites must be different", type: "error" });
      return;
    }

    if (!fromSite || !toSite || materials.length === 0 || !createdBy) {
      setNotification({
        message: "Please complete all required fields",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendMat({ ...formData, requester: createdBy });
      setNotification({ message: "Material transfer submitted successfully", type: "success" });
      setFormData({ fromSite: "", toSite: "", createdBy: userInfo?.name || "", date: new Date().toISOString().split("T")[0], materials: [] });
      toggleForm();
    } catch (error) {
      console.error("Transfer error:", error);
      setNotification({
        message: error?.response?.data?.details || "Failed to submit transfer request",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      {notification.message && (
        <div
          className={`fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Initiate Material Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* Site Selection */}
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">From Site</label>
                <select
                  name="fromSite"
                  value={formData.fromSite}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  <option value="">Select Source Site</option>
                  {sites.map((site, idx) => (
                    <option key={idx} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">To Site</label>
                <select
                  name="toSite"
                  value={formData.toSite}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  <option value="">Select Destination Site</option>
                  {sites.map((site, idx) => (
                    <option key={idx} value={site}>{site}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Material Input */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Add Material</h3>
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={materialInput.category}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Material Name</label>
                  <select
                    name="materialName"
                    value={materialInput.materialName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Material</option>
                    {categories.find(cat => cat.name === materialInput.category)?.materials.map((mat, idx) => (
                      <option key={idx} value={mat.name}>{mat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={materialInput.quantity}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={materialInput.unit}
                    readOnly
                    className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Material
                </button>
              </div>
            </div>

            {/* Material List */}
            {formData.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Added Materials</h3>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm">
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Unit</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.materials.map((mat, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-2 px-4 text-sm">{mat.category}</td>
                          <td className="py-2 px-4 text-sm">{mat.materialName}</td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              value={mat.quantity}
                              onChange={(e) => updateMaterial(idx, "quantity", e.target.value)}
                              className="border border-gray-300 p-1 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                            />
                          </td>
                          <td className="py-2 px-4 text-sm">{mat.unit}</td>
                          <td className="py-2 px-4">
                            <button
                              type="button"
                              onClick={() => removeMaterial(idx)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Card Layout */}
                <div className="sm:hidden space-y-4">
                  {formData.materials.map((mat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Category:</span> {mat.category}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Name:</span> {mat.materialName}
                        </p>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Quantity:</label>
                          <input
                            type="number"
                            value={mat.quantity}
                            onChange={(e) => updateMaterial(idx, "quantity", e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          />
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Unit:</span> {mat.unit}
                        </p>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeMaterial(idx)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={toggleForm}
                className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Transfer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferMat;