"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getHouseSchedule, requestMaterial } from "../utils/Apis";

const RequestMatForm = ({ toggleForm }) => {
  const userInfo = useSelector((state) => state.auth.user);
  const formRef = useRef(null); // Ref to scroll to the top of the form
  const notificationRef = useRef(null); // Ref to focus on notification

  const [formData, setFormData] = useState({
    engineerName: userInfo?.name || "",
    siteLocation: "",
    houseType: "",
    purpose: "",
    constructionNumber: "",
    materials: [],
  });

  const houseType = ["FD", "QD", "MS", "SD"];
  const sites = [
    "Karmo 1",
    "Karmo 2",
    "Karmo 3",
    "Kafe",
    "Jabi",
    "Guzape",
    "Jahi",
    "Karasana 1",
    "Karasana 2",
    "Idu Hof City",
  ];
  const Purpose = [
    "FOUNDATION TO GROUND FLOOR",
    "GROUND TO FIRST FLOOR",
    "FIRST TO SECOND FLOOR",
    "SECOND FLOOR TO ROOF LEVEL",
    "FIRST FLOOR TO ROOF LEVEL",
  ];

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-clear notification after 5s (increased from 3s)
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(
        () => setNotification({ message: "", type: "" }),
        5000
      );
      // Scroll to notification when it appears
      if (notificationRef.current) {
        notificationRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch materials when houseType + purpose are selected
  useEffect(() => {
    const fetchMaterials = async () => {
      if (formData.houseType && formData.purpose) {
        setLoading(true);
        setNotification({ message: "", type: "" });
        try {
          const response = await getHouseSchedule({
            houseType: formData.houseType.trim().toUpperCase(),
            purpose: formData.purpose.trim().toUpperCase(),
          });

          if (response && response.length > 0) {
            setFormData((prev) => ({
              ...prev,
              materials: response[0].materials || [],
            }));
          } else {
            setFormData((prev) => ({ ...prev, materials: [] }));
            setNotification({
              message: "No materials found for this combination.",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Failed to fetch materials:", error);
          setFormData((prev) => ({ ...prev, materials: [] }));
          setNotification({
            message: "Failed to load materials. Try again.",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => fetchMaterials(), 300); // Debounce
    return () => clearTimeout(timer);
  }, [formData.houseType, formData.purpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const missingFields = [];
    if (!formData.houseType) missingFields.push("House Type");
    if (!formData.purpose) missingFields.push("Level of Work");
    if (!formData.constructionNumber) missingFields.push("Construction Number");
    if (formData.materials.length === 0) missingFields.push("Materials");

    if (missingFields.length > 0) {
      setNotification({
        message: `Please fill in: ${missingFields.join(", ")}.`,
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.engineerName,
        constructionNo: formData.constructionNumber,
        siteLocation: formData.siteLocation,
        houseType: formData.houseType,
        purpose: formData.purpose,
        materials: formData.materials.map((m) => ({
          materialName: m.materialName,
          unit: m.unit,
          quantity: Number(m.maxQuantity),
        })),
      };

      await requestMaterial(payload);

      // Success notification
      setNotification({
        message: "Materials request submitted successfully!",
        type: "success",
      });

      // Close form after 5 seconds (increased from 3s)
      setTimeout(() => {
        toggleForm();
      }, 5000);
    } catch (error) {
      setNotification({
        message:
          error.response?.data?.details ||
          error.message ||
          "Something went wrong. Try again!",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={formRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto relative"
      >
        {notification.message && (
          <div
            ref={notificationRef}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 text-sm rounded-lg shadow-lg z-50 max-w-md w-full ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            } animate-slide-up`}
          >
            {notification.message}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4" id="form-title">
          Request Materials
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          aria-labelledby="form-title"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Engineer Name
              </label>
              <input
                type="text"
                name="engineerName"
                value={formData.engineerName}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
                aria-readonly="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Construction Number
              </label>
              <input
                type="text"
                name="constructionNumber"
                value={formData.constructionNumber}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Site Location (for record only)
              </label>
              <select
                name="siteLocation"
                value={formData.siteLocation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select site</option>
                {sites.map((site, idx) => (
                  <option key={idx} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                House Type
              </label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                aria-required="true"
              >
                <option value="">Select type</option>
                {houseType.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Level of Work
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                aria-required="true"
              >
                <option value="">Select level</option>
                {Purpose.map((purpose, idx) => (
                  <option key={idx} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Materials</h3>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-green-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                <p>Loading materials...</p>
              </div>
            ) : formData.materials.length > 0 ? (
              <div className="overflow-x-auto">
                <table
                  className="w-full border"
                  aria-describedby="materials-table"
                >
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border text-left">Material</th>
                      <th className="px-4 py-2 border text-left">Unit</th>
                      <th className="px-4 py-2 border text-left">
                        Max Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.materials.map((mat, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">
                          {mat.materialName}
                        </td>
                        <td className="px-4 py-2 border">{mat.unit}</td>
                        <td className="px-4 py-2 border">{mat.maxQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>
                No materials available. Please select house type and level of
                work.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleForm}
              className="border border-gray-500 text-gray-500 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !formData.houseType ||
                !formData.purpose ||
                !formData.constructionNumber ||
                formData.materials.length === 0 ||
                isSubmitting
              }
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ||
                !formData.houseType ||
                !formData.purpose ||
                !formData.constructionNumber ||
                formData.materials.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestMatForm;