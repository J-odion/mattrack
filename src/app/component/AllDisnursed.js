"use client";
import React, { useState, useEffect } from "react";
import { fetchDisbursedData } from "../utils/Apis";

const AllDisbursed = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [material, setMaterial] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchDisbursedData();
        console.log(data)
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

  // Filtering Function
  useEffect(() => {
    let filtered = reports;

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (siteLocation) {
      filtered = filtered.filter(report => report.siteLocation === siteLocation);
    }

    if (purpose) {
      filtered = filtered.filter(report => report.purpose === purpose);
    }

    if (material) {
      filtered = filtered.filter(report =>
        (report.materials || []).some(m => m.materialName === material)
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, siteLocation, purpose, material, reports]);

  return (
    <div className="container mx-auto p-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Site Location..."
          className="border px-3 py-2 rounded w-1/4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={siteLocation}
          onChange={(e) => setSiteLocation(e.target.value)}
        >
          <option value="">Filter by Site Location</option>
          {[...new Set(reports.map(report => report.siteLocation))].map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Filter by Purpose</option>
          {[...new Set(reports.map(report => report.purpose))].map((purp, idx) => (
            <option key={idx} value={purp}>{purp}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          <option value="">Filter by Material</option>
          {[...new Set(reports.flatMap(report => (report.materials || []).map(m => m.materialName)))].map((mat, idx) => (
            <option key={idx} value={mat}>{mat}</option>
          ))}
        </select>
      </div>

      {loading && <p>Fetching All Disbursed data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Site Location</th>
              <th className="py-2 px-4 border">House Type</th>
              <th className="py-2 px-4 border">Construction No.</th>
              <th className="py-2 px-4 border">Material Name</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Unit</th>
              <th className="py-2 px-4 border">Storekeeper</th>
              <th className="py-2 px-4 border">Recipient</th>
              <th className="py-2 px-4 border">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 ">
                  {new Date(report.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 ">{report.siteLocation}</td>
                <td className="py-2 px-4 ">{report.houseType}</td>
                <td className="py-2 px-4 ">{report.constructionNumber || "N/A"}</td>
                <td className="py-2 px-4 ">
                  {report.materialName}
                </td>
                <td className="py-2 px-4 ">{report.quantity}</td>
                <td className="py-2 px-4 ">{report.unit}</td>
                <td className="py-2 px-4 ">{report.storeKeepersName}</td>
                <td className="py-2 px-4 ">{report.recipientName}</td>
                <td className="py-2 px-4 ">{report.purpose}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllDisbursed;
