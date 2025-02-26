"use client";
import React, { useState, useEffect } from "react";
import { createSchedule } from "../utils/Apis";
import { categories, Purpose, sites, houseTypes } from "../data/data"; 

const CreateSchedule = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    purpose: "",
    siteLocation: "",
    houseType: "",
    createdBy: "chief",
    materials: [],
  });
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (["purpose", "siteLocation", "houseType"].includes(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      const updatedMaterials = [...formData.materials];
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [name]: value,
      };
      setFormData({ ...formData, materials: updatedMaterials });
    }
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { materialName: "", maxQuantity: "", unit: "" }],
    });
  };

  const removeMaterial = (index) => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Transform material data
    const payload = {
      ...formData,
      materials: formData.materials.map((mat) => ({
        materialName: mat.materialName,
        maxQuantity: parseInt(mat.maxQuantity, 10),
        unit: mat.unit,
      })),
    };

    console.log("Submitting Payload:", payload);

    try {
      await createSchedule(payload);
      setNotification({ message: "Schedule created successfully!", type: "success" });
      toggleForm();
    } catch (error) {
      console.error("Error uploading data:", error.message);
      setNotification({ message: "Failed to submit data.", type: "error" });
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
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3">
          <h2 className="text-lg font-bold mb-4">Record Material Receipt</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block mb-1">Purpose</label>
              <select name="purpose" value={formData.purpose} onChange={handleInputChange} className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select Purpose</option>
                {Purpose.map((p, index) => (
                  <option key={index} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Site Location</label>
              <select name="siteLocation" value={formData.siteLocation} onChange={handleInputChange} className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select Site</option>
                {sites.map((site, index) => (
                  <option key={index} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">House Type</label>
              <select name="houseType" value={formData.houseType} onChange={handleInputChange} className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select House Type</option>
                {houseTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {formData.materials.map((material, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4">
                <select name="materialName" value={material.materialName} onChange={(e) => handleInputChange(e, index)} className="border border-gray-300 p-2 rounded w-full">
                  <option value="">Select Material</option>
                  {categories.flatMap((cat) => cat.materials).map((mat, idx) => (
                    <option key={idx} value={mat.name}>
                      {mat.name}
                    </option>
                  ))}
                </select>
                <input type="number" name="maxQuantity" value={material.maxQuantity} onChange={(e) => handleInputChange(e, index)} className="border border-gray-300 p-2 rounded w-full" />
                <input type="text" name="unit" value={material.unit} onChange={(e) => handleInputChange(e, index)} className="border border-gray-300 p-2 rounded w-full bg-gray-100" readOnly />
                <button type="button" onClick={() => removeMaterial(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addMaterial} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Material
            </button>

            <div className="text-right">
              <button type="button" onClick={toggleForm} className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2 hover:bg-[#123962] hover:text-white">
                Cancel
              </button>
              <button type="submit" className="bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#123962]">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;
