"use client";
import React, { useState, useEffect } from "react";
import { Purpose, houseType, sites } from "../data/data";
import { requestMaterial, viewSchedule } from "../utils/Apis";
import { useSelector } from "react-redux";

const RequestMatForm = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    siteLocation: "",
    houseType: "",
    constructionNo: "",
    name: userInfo?.name || "",
    purpose: "",
    materials: [],
  });
  const [fetchedMaterials, setFetchedMaterials] = useState([]);
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

  useEffect(() => {
    const fetchMaterials = async () => {
      if (formData.siteLocation && formData.houseType && formData.purpose) {
        try {
          const response = await viewSchedule({
            siteLocation: formData.siteLocation,
            houseType: formData.houseType,
            purpose: formData.purpose,
          });

          if (Array.isArray(response.data)) {
            const extractedMaterials = response.data.flatMap((item) => item.materials);

            setFetchedMaterials(extractedMaterials);

            setFormData((prev) => ({
              ...prev,
              materials: extractedMaterials.map((material) => ({
                materialName: material.materialName,
                unit: material.unit,
                quantity: material.maxQuantity || "",
              })),
            }));
          } else {
            console.error("API response is not an array:", response.data);
            setFetchedMaterials([]);
            setFormData((prev) => ({ ...prev, materials: [] }));
          }
        } catch (error) {
          console.error("Failed to fetch materials:", error);
          setFetchedMaterials([]);
          setFormData((prev) => ({ ...prev, materials: [] }));
        }
      }
    };

    fetchMaterials();
  }, [formData.siteLocation, formData.houseType, formData.purpose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [name]: name === "quantity" ? Number.parseFloat(value) || "" : value,
    };
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.siteLocation || !formData.houseType || !formData.purpose || formData.materials.length === 0) {
      setNotification({
        message: "Please fill in all required fields and add at least one material.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await requestMaterial(formData);
      setNotification({ message: "Data successfully submitted!", type: "success" });
      toggleForm();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.details || "Something went wrong. Try again!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMaterial = (index) => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: updatedMaterials });
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
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Request Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">General Information</h3>
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Site Location</label>
                  <select
                    name="siteLocation"
                    value={formData.siteLocation}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Site Location</option>
                    {sites.map((site, idx) => (
                      <option key={idx} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Engineer's Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Purpose</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Purpose</option>
                    {Purpose.map((purpose, index) => (
                      <option key={index} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">House Type</label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a House Type</option>
                    {houseType.map((house_type, index) => (
                      <option key={index} value={house_type}>
                        {house_type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Construction Number</label>
                  <input
                    type="text"
                    name="constructionNo"
                    value={formData.constructionNo}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Materials</h3>
              {/* Desktop Materials List */}
              <div className="hidden sm:block overflow-x-auto">
                {Array.isArray(formData.materials) && formData.materials.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm">
                        <th className="py-2 px-4 border-b">Material Name</th>
                        <th className="py-2 px-4 border-b">Unit</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.materials.map((material, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-2 px-4 border-b text-sm">{material.materialName || "N/A"}</td>
                          <td className="py-2 px-4 border-b text-sm">{material.unit}</td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="number"
                              name="quantity"
                              value={material.quantity}
                              onChange={(e) => handleMaterialChange(index, e)}
                              className="border border-gray-300 p-1 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button
                              type="button"
                              onClick={() => removeMaterial(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No materials available. Please select site location, house type, and purpose.</p>
                )}
              </div>
              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4">
                {Array.isArray(formData.materials) && formData.materials.length > 0 ? (
                  formData.materials.map((material, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Material Name:</span> {material.materialName || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Unit:</span> {material.unit}
                        </p>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Quantity:</label>
                          <input
                            type="number"
                            name="quantity"
                            value={material.quantity}
                            onChange={(e) => handleMaterialChange(index, e)}
                            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No materials available. Please select site location, house type, and purpose.</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !formData.siteLocation ||
                    !formData.houseType ||
                    !formData.purpose ||
                    formData.materials.length === 0 ||
                    isSubmitting
                  }
                  className={`px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#123962] ${
                    !formData.siteLocation ||
                    !formData.houseType ||
                    !formData.purpose ||
                    formData.materials.length === 0 ||
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#123962] hover:bg-[#0e2c4f]"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestMatForm;