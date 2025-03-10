"use client"
import { useState, useEffect } from "react"
import { addRecievedData } from "../utils/Apis"
import { categories, sites } from "../data/data"
import { useSelector } from "react-redux";

const RecieveMat = ({ toggleForm }) => {
    const userInfo = useSelector((state) => state.auth.user);

    // Initialize with empty materials array
    const [formData, setFormData] = useState({
        received: "received",
        materials: [],
        siteLocation: "",
        date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
        user: userInfo?.name || "",
    })

    const [notification, setNotification] = useState({ message: "", type: "" })
    const [materialInput, setMaterialInput] = useState({
        category: "",
        materialName: "",
        quantity: "",
        unit: "",
    })

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: "", type: "" })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const updatedMaterialInput = { ...materialInput, [name]: value }

        if (name === "category") {
            updatedMaterialInput.materialName = ""
            updatedMaterialInput.unit = ""
        } else if (name === "materialName") {
            const selectedCategory = categories.find((category) => category.name === materialInput.category)
            if (selectedCategory) {
                const selectedMaterial = selectedCategory.materials.find((material) => material.name === value)
                updatedMaterialInput.unit = selectedMaterial ? selectedMaterial.unit : ""
            }
        }

        setMaterialInput(updatedMaterialInput)
    }

    const handleFormDataChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleUserSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
        setFormData({
            ...formData,
            assignedUsers: selectedOptions,
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

    const removeMaterial = (index) => {
        const updatedMaterials = [...formData.materials]
        updatedMaterials.splice(index, 1)
        setFormData({
            ...formData,
            materials: updatedMaterials,
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

    const onSubmit = async (e) => {
        e.preventDefault()

        if (formData.materials.length === 0) {
            setNotification({
                message: "Please add at least one material",
                type: "error",
            })
            return
        }

        if (!formData.siteLocation) {
            setNotification({
                message: "Please select a site location",
                type: "error",
            })
            return
        }

        console.log("Submitting payload:", formData)

        try {
            console.log("Calling addRecievedData API with payload")
            await addRecievedData(formData)
            setNotification({
                message: "Materials received successfully!",
                type: "success",
            })
            toggleForm()
        } catch (error) {
            console.error("Error uploading data:", error.message)
            setNotification({
                message: error.response?.data?.details || "Error submitting data. Please try again.",
                type: "error",
            })
        }
    }

    return (
        <div className="container mx-auto p-4">
            {/* Notification Message */}
            {notification.message && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {notification.message}
                </div>
            )}

            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Record Material Receipt</h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Site and Date Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Site Location */}
                            <div>
                                <label className="block mb-1">Site Location</label>
                                <select
                                    name="siteLocation"
                                    value={formData.siteLocation}
                                    onChange={handleFormDataChange}
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


                            <div>
                                <label className="block mb-1">storekeeper's Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.user}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
                                />
                            </div>
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

                        {/* Submit Button */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2 hover:bg-[#123962] hover:text-white"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-[#123962] text-white px-4 py-2 rounded hover:bg-opacity-90">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RecieveMat

