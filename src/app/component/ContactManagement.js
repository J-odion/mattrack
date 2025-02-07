"use client";
import React, { useState } from "react";

const ContactManagement = ({ toggleForm, handleSubmit }) => {
  const [formData, setFormData] = useState({
    date: Date.GMT,
    name: "",
    subject: "",
    message: "",
    siteLocation: "",
  });

  const [showForm, setShowForm] = useState(false);

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
    <div className="w-[60%] mx-auto p-4">
      {/* Form Modal */}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
          <h2 className="text-lg font-bold mb-4">
            Send a Message to Management
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col  ">
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col  ">
                  <label className="block mb-1">Subject:</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="block mb-1">Message:</label>
                  <input
                    type="text"
                    name="message"
                    multiple
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border border-gray-300 outline-none h-36 p-2 rounded w-full"
                  />
                </div>

                <div className="flex flex-col ">
                  <label className="block mb-1">Site :</label>
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
            <div className="flex flex-col">
              <label className="block mb-1">Store Keeper's Name:</label>
              <input
                type="text"
                name="storeKeepersName"
                value={formData.storeKeepersName}
                onChange={handleInputChange}
                className="border border-gray-300 outline-none p-2 rounded w-full"
              />
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

export default ContactManagement;
