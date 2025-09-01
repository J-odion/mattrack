"use client";
import { useState, useEffect } from "react";
import { addRecievedData } from "../utils/Apis";
import { categories, sites } from "../data/data";
import { useSelector } from "react-redux";

const RecieveMat = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with empty materials array
  const [formData, setFormData] = useState({
    received: "received",
    materials: [],
    siteLocation: "",
    date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    user: userInfo?.name || "",
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [materialInput, setMaterialInput] = useState({
    category: "",
    materialName: "",
    quantity: "",
    unit: "",
  });

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
    const updatedMaterialInput = { ...materialInput, [name]: value };

    if (name === "category") {
      updatedMaterialInput.materialName = "";
      updatedMaterialInput.unit = "";
    } else if (name === "materialName") {
      const selectedCategory = categories.find((category) => category.name === materialInput.category);
      if (selectedCategory) {
        const selectedMaterial = selectedCategory.materials.find((material) => material.name === value);
        updatedMaterialInput.unit = selectedMaterial ? selectedMaterial.unit : "";
      }
    }

    setMaterialInput(updatedMaterialInput);
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addMaterial = () => {
    if (!materialInput.materialName || !materialInput.quantity) {
      setNotification({
        message: "Please fill in material name and quantity",
        type: "error",
      });
      return;
    }
    const newMaterial = {
      category: materialInput.category,
      materialName: materialInput.materialName,
      quantity: Number.parseFloat(materialInput.quantity) || 0,
      unit: materialInput.unit,
    };

    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    });

    // Reset material input fields
    setMaterialInput({
      category: "",
      materialName: "",
      quantity: "",
      unit: "",
    });
  };

  const removeMaterial = (index) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials.splice(index, 1);
    setFormData({
      ...formData,
      materials: updatedMaterials,
    });
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === "quantity" ? Number.parseFloat(value) || 0 : value,
    };

    setFormData({
      ...formData,
      materials: updatedMaterials,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.materials.length === 0) {
      setNotification({
        message: "Please add at least one material",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.siteLocation) {
      setNotification({
        message: "Please select a site location",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting payload:", formData);

    try {
      console.log("Calling addRecievedData API with payload");
      await addRecievedData(formData);
      setNotification({
        message: "Materials received successfully!",
        type: "success",
      });
      toggleForm();
    } catch (error) {
      console.error("Error uploading data:", error.message);
      setNotification({
        message: error.response?.data?.details || "Error submitting data. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      {/* Notification Message */}
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
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Record Material Receipt</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Site and Date Information */}
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
              {/* Site Location */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Site Location</label>
                <select
                  name="siteLocation"
                  value={formData.siteLocation}
                  onChange={handleFormDataChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  <option value="">Select a Site Location</option>
                  {sites.map((site, index) => (
                    <option key={index} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Storekeeper's Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.user}
                  readOnly
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Add Material Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Add Material</h3>
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
                {/* Material Category */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Material Category</label>
                  <select
                    name="category"
                    value={materialInput.category}
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
                    value={materialInput.materialName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    <option value="">Select a Material</option>
                    {categories
                      .find((category) => category.name === materialInput.category)
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
                    value={materialInput.quantity}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  />
                </div>
                {/* Unit of Measurement */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={materialInput.unit}
                    readOnly
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Material
                </button>
              </div>
            </div>

            {/* Materials List */}
            {formData.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Added Materials</h3>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm">
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Material Name</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Unit</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.materials.map((material, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-2 px-4 border-b text-sm">{material.category}</td>
                          <td className="py-2 px-4 border-b text-sm">{material.materialName}</td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="number"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                              className="border border-gray-300 p-1 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                            />
                          </td>
                          <td className="py-2 px-4 border-b text-sm">{material.unit}</td>
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
                </div>
                {/* Mobile Card Layout */}
                <div className="sm:hidden space-y-4">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Category:</span> {material.category}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Material Name:</span> {material.materialName}
                        </p>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Quantity:</label>
                          <input
                            type="number"
                            value={material.quantity}
                            onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          />
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Unit:</span> {material.unit}
                        </p>
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
                  ))}
                </div>
              </div>
            )}

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
  );
};

export default RecieveMat;