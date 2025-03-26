"use client";
import React, { useState, useEffect } from "react";
import { sites, categories } from "../data/data";
import { sendMat } from "../utils/Apis";
import { useSelector } from "react-redux";

const TransferMat = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    fromSite: "",
    toSite: "",
    materials: [],
  });
  const [materialInput, setMaterialInput] = useState({
    category: "",
    materialName: "",
    quantity: "",
    unit: "",
})
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

 
  const removeMaterial = (index) => {
    const updatedMaterials = [...formData.materials]
    updatedMaterials.splice(index, 1)
    setFormData({
      ...formData,
      materials: updatedMaterials,
    })
  }

  const addMaterial = () => {
    if (!materialInput.materialName || !materialInput.quantity) {
      setNotification({
        message: "Please fill in material name and quantity",
        type: "error",
      })
      return
    }
    const newMaterial = {
      category: materialInput.category,
      materialName: materialInput.materialName,
      quantity: Number.parseFloat(materialInput.quantity) || 0,
      unit: materialInput.unit,
    }

    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    })

    // Reset material input fields
    setMaterialInput({
      category: "",
      materialName: "",
      quantity: "",
      unit: "",
    })
  }

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...formData.materials]
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === "quantity" ? Number.parseFloat(value) || 0 : value,
    }

    setFormData({
      ...formData,
      materials: updatedMaterials,
    })
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "fromSite" || name === "toSite") {
      // Update formData for site selections
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // Update materialInput for material selection
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
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMat({ ...formData, createdBy: userInfo.id });
      setNotification({ message: "Transfer successfully initiated!", type: "success" });
      toggleForm();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Something went wrong. Try again!",
      });
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
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-lg font-bold mb-4">Initiate Material Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1">From Site</label>
              <select name="fromSite" value={formData.fromSite} onChange={handleInputChange} className="border p-2 rounded w-full">
                <option value="">Select Source Site</option>
                {sites.map((site, idx) => (
                  <option key={idx} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">To Site</label>
              <select name="toSite" value={formData.toSite} onChange={handleInputChange} className="border p-2 rounded w-full">
                <option value="">Select Destination Site</option>
                {sites.map((site, idx) => (
                  <option key={idx} value={site}>{site}</option>
                ))}
              </select>
            </div>
            {/* Add Material Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Add Material</h3>
              <div className="grid md:grid-cols-4 gap-3">
                {/* Material Category */}
                <div>
                  <label className="block mb-1 text-sm">Material Category</label>
                  <select
                    name="category"
                    value={materialInput.category}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
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
                  <label className="block mb-1 text-sm">Material Name</label>
                  <select
                    name="materialName"
                    value={materialInput.materialName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
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
                  <label className="block mb-1 text-sm">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={materialInput.quantity}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                {/* Unit of Measurement */}
                <div>
                  <label className="block mb-1 text-sm">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={materialInput.unit}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Add Material
                </button>
              </div>
            </div>

            {/* Materials Table */}
            {formData.materials.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="font-semibold mb-2">Added Materials</h3>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Category</th>
                      <th className="py-2 px-4 border-b text-left">Material Name</th>
                      <th className="py-2 px-4 border-b text-left">Quantity</th>
                      <th className="py-2 px-4 border-b text-left">Unit</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.materials.map((material, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="py-2 px-4 border-b">{material.category}</td>
                        <td className="py-2 px-4 border-b">{material.materialName}</td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="number"
                            value={material.quantity}
                            onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                            className="border border-gray-300 p-1 rounded w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">{material.unit}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="text-right">
              <button type="button" onClick={toggleForm} className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2">Cancel</button>
              <button type="submit" className="bg-[#123962] text-white px-4 py-2 rounded">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferMat;