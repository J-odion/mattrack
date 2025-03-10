"use client";
import React, { useState, useEffect } from "react";
import { fetchDisbursedData } from "../utils/Apis";

const AllDisbursed = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: "",
    materialName: "",
    quantity: "",
    unit: "",
    recipientName: "",
    siteLocation: "",
    houseType: "",
    purpose: "",
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchDisbursedData();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    const filteredData = reports.filter((report) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        const value = report[key]?.toString().toLowerCase() || "";
        return value.includes(filters[key].toLowerCase());
      });
    });

    setFilteredReports(filteredData);
  }, [filters, reports]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {Object.keys(filters).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={`Search by ${key.replace(/([A-Z])/g, ' $1')}`}
            className="border p-2"
            value={filters[key]}
            onChange={handleFilterChange}
          />
        ))}
      </div>

      {loading && <p>Fetching All Disbursed data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 font-normal text-left">
              {Object.keys(filters).map((key) => (
                <th key={key} className="py-2 px-4 border-b text-[12px] capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                {Object.keys(filters).map((key) => (
                  <td key={key} className="py-2 px-4 border-b text-[12px]">
                    {report[key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllDisbursed;
