"use client";
import React, { useState } from "react";
import { addDisbursedData, addRecievedData } from "../utils/Apis";

const AddReportForm = ({ toggleForm }) => {
  const[formData, setFormData] = useState({
    materialManagement: "disbursed", // Default selection
    materialCategory: "",
    materialName: "",
    quantity: "",
    siteLocation: "",
    unit: "",
    storeKeepersName: "",
    recipientName: "",
    houseNumber: "",
    purpose: "",
    houseType: "",
    date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
  });
  const [disbursedData, setDisbursedData] = useState({
    materialManagement: "Disbursed",
    materialCategory: formData.materialCategory,
    materialName: formData.materialName,
    quantity: formData.quantity,
    siteLocation: formData.siteLocation,
    unit: formData.unit,
    storeKeepersName: formData.storeKeepersName,
    recipientName: formData.recipientName,
    houseNumber: formData.houseNumber,
    purpose: formData.purpose,
    houseType: formData.houseType,
    date: formData.date,
  });

  const [receivedData, setReceivedData] = useState({
    received: "received", // Ensure this key exists
    materialCategory: formData.materialCategory,
    materialName: formData.materialName,
    quantity: formData.quantity,
    unit: formData.unit,
    siteLocation: formData.siteLocation,
    houseType: formData.houseType,
    date: formData.date,
  });


  const [showForm, setShowForm] = useState(false);

  const categories = {
    wood: ["Plywood", "Timber", "Particle Board"],
    nails: ["Roof Nails", "Common Nails", "Masonry Nails"],
    rods: ["Iron Rods", "Steel Bars", "Reinforcement Mesh"],
    cement: [
      "Ordinary Portland Cement",
      "White Cement",
      "Rapid Hardening Cement",
    ],
    sand: ["Fine Sand", "Coarse Sand", "River Sand"],
  };
  const purposes = ["FDN", "Lintel", "Decking", "Block Work", "Plastering"];

  const houseTypes = ["FD", "SM", "QD", "D"];
  const houseNumber = ["FD1", "FD2", "SM1", "SM2", "QD1", "QD2", "D1", "D2"];
  const sites = [
    "Idu Hof Community",
    "Hof court Karimo 1",
    "Hof Court Karimo 2",
    "Hof Court Karimo 3",
  ];

  const materialNames = ["Please select a category"];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("form Data:", formData)

    try {
      // Conditionally call the correct API based on materialManagement
      if (formData.materialManagement === "received") {
        console.log('submitted addRecievedData API')
        await addRecievedData(receivedData);
      } else if (formData.materialManagement === "disbursed") {
        console.log('submitted addDisbursedData API')
        await addDisbursedData(disbursedData);
      }

      toggleForm();
    } catch (error) {
      // Handle the error (you can show an error message or any other error handling)
      console.error("Error uploading data:", error.message);
    }
  };


  return (
    <div className="container mx-auto p-4">
      {/* Form Modal */}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3">
          <h2 className="text-lg font-bold mb-4">Manage Inventory</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Section 1: Material Information */}
            <div>
              <h3 className="text-md font-semibold mb-2">
                Material Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Material Management Dropdown */}
                <div>
                  <label className="block mb-1">Material Management</label>
                  <select
                    name="materialManagement"
                    value={formData.materialManagement}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="received">Received</option>
                    <option value="disbursed">Disbursed</option>
                  </select>
                </div>
                {/* Material Category */}
                <div>
                  <label className="block mb-1">Material Category</label>
                  <select
                    name="materialCategory"
                    value={formData.materialCategory}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select a Category</option>
                    {Object.keys(categories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Material Name */}
                <div>
                  <label className="block mb-1">Material Name</label>
                  <select
                    name="materialName"
                    value={formData.materialName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select a Material</option>
                    {(
                      categories[formData.materialCategory] || materialNames
                    ).map((material, index) => (
                      <option key={index} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Quantity */}
                <div>
                  <label className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                {/* Unit of Measurement */}
                <div>
                  <label className="block mb-1">Unit of Measurement</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select Unit</option>
                    <option value="bags">Bags</option>
                    <option value="pcs">Pcs</option>
                    <option value="trips">Trips</option>
                    <option value="tons">Tons</option>
                  </select>
                </div>
                {/* Site Location */}
                <div>
                  <label className="block mb-1">Site Location</label>
                  <select
                    name="siteLocation"
                    value={formData.siteLocation}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select a Site Location</option>
                    {sites.map((site, index) => (
                      <option key={index} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Recipient Details for Disbursed */}
                {formData.materialManagement === "disbursed" && (
                  <>
                    <div>
                      <label className="block mb-1">Recipient Name</label>
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded w-full"
                      />
                    </div>
                    {/* House Type */}
                    <div>
                      <label className="block mb-1">House Type</label>
                      <select
                        name="houseType"
                        value={formData.houseType}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded w-full"
                      >
                        <option value="">Select a House Type</option>
                        {houseTypes.map((houseType, index) => (
                          <option key={index} value={houseType}>
                            {houseType}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* House Number */}
                    <div>
                      <label className="block mb-1">House Number</label>
                      <select
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded w-full"
                      >
                        <option value="">Select a House Number</option>
                        {houseNumber.map((houseNumber, index) => (
                          <option key={index} value={houseNumber}>
                            {houseNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* purpose  */}
                    <div>
                      <label className="block mb-1">Purpose</label>
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded w-full"
                      >
                        <option value="">Select a Purpose</option>
                        {purposes.map((purpose) => (
                          <option key={purpose} value={purpose}>
                            {purpose}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Approval */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Store Keeper's Name</label>
                  <input
                    type="text"
                    name="storeKeepersName"
                    value={formData.storeKeepersName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="button"
                onClick={toggleForm}
                className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2 hover:bg-[#123962] hover:text-white "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#123962]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReportForm;
