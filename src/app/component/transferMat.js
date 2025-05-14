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
      quantity: parseFloat(materialInput.quantity),
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
    updatedMaterials[index][field] = field === "quantity" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fromSite, toSite, materials } = formData;

    if (fromSite === toSite) {
      setNotification({ message: "Source and destination sites must be different", type: "error" });
      return;
    }

    if (!fromSite || !toSite || materials.length === 0) {
      setNotification({
        message: "Please complete the form properly",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendMat({ ...formData, requester: userInfo?.name || "Unknown" });

      setNotification({ message: "Material transfer submitted", type: "success" });
      setFormData({ fromSite: "", toSite: "", createdBy: userInfo?.name || "", materials: [] });
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
    <div className="container mx-auto p-4">
      {notification.message && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {notification.message}
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-lg font-bold mb-4">Initiate Material Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* From Site */}
            <div>
              <label className="block mb-1">From Site</label>
              <select name="fromSite" value={formData.fromSite} onChange={handleInputChange} className="border p-2 rounded w-full">
                <option value="">Select Source Site</option>
                {sites.map((site, idx) => (
                  <option key={idx} value={site}>{site}</option>
                ))}
              </select>
            </div>

            {/* To Site */}
            <div>
              <label className="block mb-1">To Site</label>
              <select name="toSite" value={formData.toSite} onChange={handleInputChange} className="border p-2 rounded w-full">
                <option value="">Select Destination Site</option>
                {sites.map((site, idx) => (
                  <option key={idx} value={site}>{site}</option>
                ))}
              </select>
            </div>

            {/* Material Input */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Add Material</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="block mb-1 text-sm">Category</label>
                  <select name="category" value={materialInput.category} onChange={handleInputChange} className="border p-2 rounded w-full">
                    <option value="">Select a Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Material Name</label>
                  <select name="materialName" value={materialInput.materialName} onChange={handleInputChange} className="border p-2 rounded w-full">
                    <option value="">Select a Material</option>
                    {categories.find(cat => cat.name === materialInput.category)?.materials.map((mat, idx) => (
                      <option key={idx} value={mat.name}>{mat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Quantity</label>
                  <input type="number" name="quantity" value={materialInput.quantity} onChange={handleInputChange} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Unit</label>
                  <input type="text" name="unit" value={materialInput.unit} readOnly className="border p-2 rounded w-full bg-gray-100" />
                </div>
              </div>
              <div className="mt-3 text-right">
                <button type="button" onClick={addMaterial} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Add Material</button>
              </div>
            </div>

            {/* Material Table */}
            {formData.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Added Materials</h3>
                <table className="w-full bg-white border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Unit</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.materials.map((mat, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{mat.category}</td>
                        <td className="p-2">{mat.materialName}</td>
                        <td className="p-2">
                          <input type="number" value={mat.quantity} onChange={(e) => updateMaterial(idx, "quantity", e.target.value)} className="border rounded p-1 w-full" />
                        </td>
                        <td className="p-2">{mat.unit}</td>
                        <td className="p-2">
                          <button type="button" onClick={() => removeMaterial(idx)} className="text-red-500 hover:underline text-xs">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-right">
              <button type="button" onClick={toggleForm} className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2">Cancel</button>
              <button type="submit" disabled={isSubmitting} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
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
