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
    materials: [{ materialName: "", maxQuantity: "", unit: "" }],
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      let updatedFormData = { ...formData, [name]: value };
      if (name === "siteLocation") {
        updatedFormData.houseType = ""; // Reset houseType when siteLocation changes
      }
      setFormData(updatedFormData);
    } else {
      const updatedMaterials = [...formData.materials];
      updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };

      if (name === "materialName") {
        const selectedMaterial = categories
          .flatMap((cat) => cat.materials)
          .find((mat) => mat.name === value);
        updatedMaterials[index].unit = selectedMaterial ? selectedMaterial.unit : "";
      }

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
    if (formData.materials.length > 1) {
      const updatedMaterials = formData.materials.filter((_, i) => i !== index);
      setFormData({ ...formData, materials: updatedMaterials });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });

    // Validation
    if (!formData.purpose || !formData.siteLocation || !formData.houseType) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    if (
      formData.materials.some(
        (mat) => !mat.materialName || !mat.maxQuantity || parseFloat(mat.maxQuantity) <= 0
      )
    ) {
      setNotification({
        message: "Please complete all material fields with valid quantities.",
        type: "error",
      });
      return;
    }

    const payload = {
      ...formData,
      materials: formData.materials.map((mat) => ({
        materialName: mat.materialName,
        maxQuantity: parseInt(mat.maxQuantity, 10),
        unit: mat.unit,
      })),
    };

    setIsSubmitting(true);

    try {
      await createSchedule(payload);
      setNotification({ message: "Schedule created successfully!", type: "success" });
      setFormData({
        purpose: "",
        siteLocation: "",
        houseType: "",
        createdBy: "chief",
        materials: [{ materialName: "", maxQuantity: "", unit: "" }],
      });
      setTimeout(() => {
        toggleForm();
      }, 1000);
    } catch (error) {
      setNotification({
        message: error.message || "Failed to create schedule. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
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

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Create Schedule</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Purpose *</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                  >
                    <option value="">Select Purpose</option>
                    {Purpose.map((p, index) => (
                      <option key={index} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Site Location *</label>
                  <select
                    name="siteLocation"
                    value={formData.siteLocation}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                  >
                    <option value="">Select Site</option>
                    {sites.map((site, index) => (
                      <option key={index} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">House Type *</label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    required
                    disabled={!formData.siteLocation}
                  >
                    <option value="">Select House Type</option>
                    {houseTypes
                      .filter((type) => {
                        const site = sites.find((s) => s === formData.siteLocation);
                        return site ? type.site === site : true;
                      })
                      .map((type, index) => (
                        <option key={index} value={type.type}>
                          {type.type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Materials</h3>
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex flex-col gap-4 sm:grid sm:grid-cols-4 sm:gap-4 mb-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Material Name *</label>
                      <select
                        name="materialName"
                        value={material.materialName}
                        onChange={(e) => handleInputChange(e, index)}
                        className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        required
                      >
                        <option value="">Select Material</option>
                        {categories.flatMap((cat) => cat.materials).map((mat, idx) => (
                          <option key={idx} value={mat.name}>
                            {mat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Max Quantity *</label>
                      <input
                        type="number"
                        name="maxQuantity"
                        value={material.maxQuantity}
                        onChange={(e) => handleInputChange(e, index)}
                        className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                      <input
                        type="text"
                        name="unit"
                        value={material.unit}
                        className="border border-gray-300 p-2 rounded-md w-full text-sm bg-gray-100 focus:outline-none"
                        readOnly
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Material
                </button>
              </div>

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
                  className={`bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;