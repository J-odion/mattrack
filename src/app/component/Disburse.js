"use client";
import React, { useState, useEffect } from "react";
import { categories, Purposes, locations } from "../data/data";
import { addDisbursedData } from "../utils/Apis";
import { useSelector } from "react-redux";

const DisburseData = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    disbursed: "disbursed",
    materialCategory: "",
    materialName: "",
    quantity: "",
    siteLocation: "",
    houseType: "",
    constructionNumber: "",
    unit: "",
    storeKeeperName: userInfo?.name || "",
    recipientName: "",
    purpose: "",
    levelofwork: "",
    date: new Date().toISOString().split("T")[0],
    assignedUser: {
      id: userInfo?.id || "",
      name: userInfo?.name || "",
      email: userInfo?.email || "",
    },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "siteLocation") {
      updatedFormData.houseType = "";
      updatedFormData.constructionNumber = "";
    }

    if (name === "materialCategory") {
      updatedFormData.materialName = "";
      updatedFormData.unit = "";
    }

    if (name === "materialName") {
      const selectedCategory = categories.find(
        (category) => category.name === formData.materialCategory
      );
      const selectedMaterial = selectedCategory?.materials.find(
        (material) => material.name === value
      );
      updatedFormData.unit = selectedMaterial ? selectedMaterial.unit : "";
    }

    setFormData(updatedFormData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      "materialCategory",
      "materialName",
      "quantity",
      "siteLocation",
      "houseType",
      "constructionNumber",
      "recipientName",
      "purpose",
      "levelofwork",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      setNotification({
        type: "error",
        message: "Quantity must be greater than zero.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDisbursedData(formData);
      setNotification({ message: "Data successfully submitted!", type: "success" });
      setFormData({
        disbursed: "disbursed",
        materialCategory: "",
        materialName: "",
        quantity: "",
        siteLocation: "",
        houseType: "",
        constructionNumber: "",
        unit: "",
        storeKeeperName: userInfo?.name || "",
        recipientName: "",
        purpose: "",
        levelofwork: "",
        date: new Date().toISOString().split("T")[0],
        assignedUser: {
          id: userInfo?.id || "",
          name: userInfo?.name || "",
          email: userInfo?.email || "",
        },
      });
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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification Message */}
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
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Disburse Material</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                {/* Assigned User (Hidden Fields) */}
                <input type="hidden" name="assignedUserId" value={formData.assignedUser.id} />
                <input type="hidden" name="assignedUserName" value={formData.assignedUser.name} />
                <input type="hidden" name="assignedUserEmail" value={formData.assignedUser.email} />

                {/* Storekeeper's Name */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Storekeeper</label>
                  <input
                    type="text"
                    name="storeKeeperName"
                    value={formData.storeKeeperName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    disabled
                  />
                </div>

                {/* Engineer's Name */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Engineer's Name</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  />
                </div>

                {/* Material Category */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Material Category</label>
                  <select
                    name="materialCategory"
                    value={formData.materialCategory}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material Name */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Material Name</label>
                  <select
                    name="materialName"
                    value={formData.materialName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    disabled={!formData.materialCategory}
                  >
                    <option value="">Select a Material</option>
                    {categories
                      .find((category) => category.name === formData.materialCategory)
                      ?.materials.map((material, index) => (
                        <option key={index} value={material.name}>
                          {material.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    min="0"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm bg-gray-100 focus:outline-none"
                    readOnly
                  />
                </div>

                {/* Site Location */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Site Location</label>
                  <select
                    name="siteLocation"
                    value={formData.siteLocation}
                    onChange={handleInputChange}
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

                {/* House Type */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">House Type</label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    disabled={!formData.siteLocation}
                  >
                    <option value="">Select a House Type</option>
                    {locations
                      .find((site) => site.name === formData.siteLocation)
                      ?.houseTypes.map((house, index) => (
                        <option key={index} value={house.type}>
                          {house.type}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Construction Number */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Construction Number</label>
                  <input
                    type="number"
                    name="constructionNumber"
                    value={formData.constructionNumber}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    min="0"
                  />
                </div>

                {/* Level of Work */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Level of Work</label>
                  <select
                    name="levelofwork"
                    value={formData.levelofwork}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Level of Work</option>
                    {Purposes.map((level, index) => (
                      <option key={index} value={level.name}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Purpose</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    disabled={!formData.levelofwork}
                  >
                    <option value="">Select a Purpose</option>
                    {Purposes.find((item) => item.name === formData.levelofwork)
                      ?.work.map((work, index) => (
                        <option key={index} value={work}>
                          {work}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
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

export default DisburseData;