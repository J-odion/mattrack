"use client";
import React, { useState, useEffect } from "react";
import { Purpose, house_types, sites } from "../data/data";
import { requestMaterial, viewHouseSchedule,  } from "../utils/Apis";
import { useSelector } from "react-redux";

const TransferMat = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    siteLocation: "",
    houseType: "",
    name: userInfo?.name || "" ,
    purpose: "",
    materials: [],
  });
  const [fetchedMaterials, setFetchedMaterials] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

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
          const response = await viewHouseSchedule({
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestMaterial(formData);
      setNotification({ message: "Data successfully submitted!", type: "success" });
      toggleForm();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.details || "Something went wrong. Try again!",
      });
    }
  };

  const removeMaterial = (index) => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: updatedMaterials });
  };

  return (
    <div className="container mx-auto p-4">
      {notification.message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white overflow-y-scroll p-6 rounded-lg h-[60%] shadow-lg w-1/2">
          <h2 className="text-lg font-bold mb-4">Request Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div>
              <h3 className="text-md font-semibold mb-2">General Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Site Location</label>
                  <select
                    name="siteLocation"
                    value={formData.siteLocation}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
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
                  <label className="block mb-1">Engineer's Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    readOnly
                    className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Purpose</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
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
                  <label className="block mb-1">House Type</label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select a House Type</option>
                    {house_types.map((house_type, index) => (
                      <option key={index} value={house_type}>
                        {house_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="container overflow-hidden w-full h-full">
              <div className="h-[70%] overflow-y-hidden">
                <div className="">
                  <h3 className="text-md font-semibold mb-2">Materials</h3>
                  {Array.isArray(fetchedMaterials) && fetchedMaterials.map((material, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 items-center gap-4 mb-4  p-2 rounded"
                    >
                      <div>
                        <label className="block mb-1">Material Name</label>
                        <input
                          type="text"
                          name="materialName"
                          value={material.materialName || "N/A"}
                          readOnly
                          className="border border-gray-300 p-2 rounded w-full bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Unit</label>
                        <input
                          type="text"
                          name="unit"
                          value={material.unit}
                          readOnly
                          className="border border-gray-300 p-2 rounded w-full bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={material.maxQuantity || "N/A"}
                          readOnly
                          onChange={(e) => handleMaterialChange(index, e)}
                          className="border border-gray-300 p-2 rounded w-full bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#123962] text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferMat;