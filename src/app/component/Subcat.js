"use client";
import React, { useState } from "react";
import DynamicTable from "./Table";

const filters = {
  "Inventory Stock": {
    "Site": [
    "Idu Hof Community",
    "Hof court Karimo 1",
    "Hof Court Karimo 2",
    "Hof Court Karimo 3",
  ],
  "Material": {
    wood: ["Plywood", "Timber", "Particle Board"],
    nails: ["Roof Nails", "Common Nails", "Masonry Nails"],
    rods: ["Iron Rods", "Steel Bars", "Reinforcement Mesh"],
    cement: [
      "Ordinary Portland Cement",
      "White Cement",
      "Rapid Hardening Cement",
    ],
  },
  },
  "Tracking Records": {
    "Site": [
    "Idu Hof Community",
    "Hof court Karimo 1",
    "Hof Court Karimo 2",
    "Hof Court Karimo 3",
  ],
  "House Type": ["FD", "SM", "QD", "D"],
  "Purpose": ["FDN", "Lintel", "Decking", "Block Work", "Plastering"],
  "Material": {
    wood: ["Plywood", "Timber", "Particle Board"],
    nails: ["Roof Nails", "Common Nails", "Masonry Nails"],
    rods: ["Iron Rods", "Steel Bars", "Reinforcement Mesh"],
    cement: [
      "Ordinary Portland Cement",
      "White Cement",
      "Rapid Hardening Cement",
    ],
  },
  "Date": ["Daily", "Weekly", "Monthy", "Yearly"],
  }
};

export default function Subcat() {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [path, setPath] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterClick = (key) => {
    const nextFilters = currentFilters[key];
    if (typeof nextFilters === "object" || Array.isArray(nextFilters)) {
      setCurrentFilters(nextFilters);
      setPath([...path, key]);
    } else {
      setPath([...path, key]);
      setShowTable(true);
    }
  };

  const handleAllClick = () => {
    if (path.length === 0) {
      setCurrentFilters(filters);
      setShowTable(false);
    } else {
      const newPath = path.slice(0, -1);
      let newFilters = filters;
      newPath.forEach((p) => {
        newFilters = newFilters[p];
      });
      setCurrentFilters(newFilters);
      setPath(newPath);
      setShowTable(false);
    }
  };

  const generateMenu = () => {
    if (typeof currentFilters === "object" && !Array.isArray(currentFilters)) {
      return ["All", ...Object.keys(currentFilters)];
    }
    if (Array.isArray(currentFilters)) {
      return ["All", ...currentFilters];
    }
    return ["All"];
  };

  return (
    <section className="px-10 py-[96px] gap-y-[64px] w-[100%] text-[12px] justify-center flex flex-col mx-auto items-center">
      <div className="mb-4 flex justify-between items-center w-[60%]">
        <button
          onClick={handleAllClick}
          className={`w-[80px] flex justify-center text-[12px] items-center text-white border bg-[#123962] h-[40px] rounded-[34px] p-[4px] ${
            path.length === 0 ? "hidden" : ""
          }`}
          disabled={path.length === 0}
        >
          Go Back
        </button>
        <p className="items-end justify-end ">Current Path: {path.join(" / ") || "Root"}</p>
        {/* <p>Selected Filters: {selectedFilters.join(", ") || "None"}</p> */}
      </div>

      {!showTable ? (
        <div id="services" className="grid lg:grid-cols-4 gap-[24px] mb-[64px]">
          {generateMenu().map((key, index) => (
            <div
              key={index}
              className="w-[200px] flex justify-center items-center border border-[#123962] h-[40px]  rounded-[34px] p-[4px]"
            >
              <button
                onClick={() => handleFilterClick(key)}
                className="w-full text-[12px] text-[#123962] font-semibold"
              >
                {key}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <DynamicTable />
        </div>
      )}
    </section>
  );
}
