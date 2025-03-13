"use client";
import React, { useState, useEffect } from "react";
import { categories, Purpose, locations } from "../data/data";
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
    storeKeepersName: userInfo?.name || "",
    recipientName: "",
    purpose: "",
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
    }

    if (name === "materialName") {
      // Find the selected material and set the unit automatically
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
        storeKeepersName: userInfo?.name || "",
        recipientName: "",
        purpose: "",
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
    <div className="container mx-auto p-4 relative">
      {/* Notification Message */}
      {notification.message && (
        <div
          className={`fixed z-[9999] top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {notification.message}
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3">
          <h2 className="text-lg font-bold mb-4">Disburse Material</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Assigned User (Hidden Fields) */}
              <input type="hidden" name="assignedUserId" value={formData.assignedUser.id} />
              <input type="hidden" name="assignedUserName" value={formData.assignedUser.name} />
              <input type="hidden" name="assignedUserEmail" value={formData.assignedUser.email} />

              {/* Storekeeper's Name */}
              <div>
                <label className="block mb-1 text-2xs">Storekeeper</label>
                <input
                  type="text"
                  name="storekeeper"
                  value={formData.storeKeepersName}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
                />
              </div>

              {/* Engineer's Name */}
              <div>
                <label className="block mb-1 text-2xs">Engineer's Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-2xs">Material Category</label>
                <select
                  name="materialCategory"
                  value={formData.materialCategory}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
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
                <label className="block mb-1 text-2xs">Material Name</label>
                <select
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
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
                <label className="block mb-1 text-2xs">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
                />
              </div>
              {/* Unit (Automatically Set) */}
              <div>
                <label className="block text-2xs mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  className="border border-gray-300 text-2xs p-2 rounded w-full bg-gray-100"
                  readOnly
                />
              </div>


              {/* Site Location */}
              <div>
                <label className="block text-2xs mb-1">Site Location</label>
                <select
                  name="siteLocation"
                  value={formData.siteLocation}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
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
                <label className="block text-2xs mb-1">House Type</label>
                <select
                  name="houseType"
                  value={formData.houseType}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
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

              {/* Construction Number (Fixed) */}
              <div>
                <label className="block text-2xs mb-1">Construction Number</label>
                <input
                  type="text"
                  name="constructionNumber"
                  value={formData.constructionNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-2xs mb-1">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-2xs p-2 rounded w-full"
                >
                  <option value="">Select a Purpose</option>
                  {Purpose.map((purpose, index) => (
                    <option key={index} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="button"
                onClick={toggleForm}
                className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2 hover:bg-[#123962] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#123962] disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisburseData;
