"use client";
import React, { useState } from "react";

const RequestMatForm = ({ toggleForm, handleSubmit }) => {
  const [formData, setFormData] = useState({
    date: Date.GMT,
    materialManagement: "",
    materialCategory: "",
    materialName: "",
    quantity: "",
    siteLocation: "",
    unit: "",
    recipientName: "",
    storeKeepersName: "",
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

  return (
    <div className="container mx-auto p-4">
      {/* Form Modal */}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-lg font-bold mb-4">Request Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Material Information */}
            <div>
              <h3 className="text-md font-semibold mb-2">
                Material Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                
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

export default RequestMatForm;
