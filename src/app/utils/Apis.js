import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASEURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// API Calls

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);

    if (response.data && response.data.token && response.data.payload.user) {
      localStorage.setItem("authToken", response.data.token);
      return { token: response.data.token, user: response.data.payload.user };
    } else {
      throw new Error("Invalid response data");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const RegisterUser = async (credentials) => {
  try {
    const response = await apiClient.post("/register", credentials);

    console.log("Registration Success:", response.data.user, "testing");

    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Registration failed. Please try again.");
  }
};

export const Verifyotp = async (credentials) => {
  try {
    const response = await apiClient.post("/verify-otp", credentials);
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

export const Resendotp = async (credentials) => {
  try {
    const response = await apiClient.post("/resend-otp", credentials);
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

export const resetPassword = async (credentials) => {
  try {
    const response = await apiClient.post("/reset-password", credentials);

    if (response.data && response.data.token && response.data.payload) {
      localStorage.setItem("authToken", response.data.token);
      return { token: response.data.token, data: response.data.payload };
    } else {
      throw new Error("Invalid response data");
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

// Table data
export const fetchTableData = async () => {
  try {
    const response = await apiClient.get("/data");
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

export const addRecievedData = async (credentials) => {
  try {
    const response = await apiClient.post("/data", credentials);
    console.log()
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }

};

export const addDisbursedData = async (credentials) => {
  try {
    const response = await apiClient.post("/disburseddata", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }
};

export const sendMat = async (credentials) => {
  try {
    const response = await apiClient.post("/transfer", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }
};

export const getTransfer = async () => {
  try {
    const response = await apiClient.get("/transfer");
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const recieveMat = async ({ transferId, approvedBy }) => {
  try {
    const response = await apiClient.patch(`/transferAccept/${transferId}`, {
      approvedBy,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};



export const fetchDisbursedData = async () => {
  try {
    const response = await apiClient.get("/disburseddata");

    // Ensure the response contains an array
    if (!response.data || !Array.isArray(response.data)) {
      console.error("Invalid response format:", response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error.message);
    return []; // Return an empty array instead of throwing an error
  }
};

export const transferData = async (credentials) => {
  try {
    const response = await apiClient.post("/disburseddata", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }
};

export const fetchAllInventory = async () => {
  try {
    const response = await apiClient.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

// request material
export const requestMaterial = async (credentials) => {
  try {
    const response = await apiClient.post("/requestMaterial", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Accept material request
export const reviewMaterialRequest = async (id, data) => {
  try {
  } catch (error) {
    throw error;
  }
};

// Get material requests
export const getMaterialRequest = async () => {
  try {
    const response = await apiClient.get("/requestMaterial");
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const addStandardAllocation = async (credentials) => {
  try {
    const response = await apiClient.post("/schedule", credentials);
    console.log()
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }

};

export const viewAllStaff = async () => {
  try {
    const response = await apiClient.get("/allStaff");
    console.log()
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }

};

// Edit a specific staff member
export const editStaff = async (id, credentials) => {
  try {
    const response = await apiClient.put(`/allStaff/${id}`, credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw actual error for handling in UI
  }
};

// Delete a specific staff member
export const deleteStaff = async (id) => {
  try {
    const response = await apiClient.delete(`/allStaff/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// request material schedule
export const createSchedule = async (credentials) => {
  try {
    const response = await apiClient.post("/schedule", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const viewSchedule = async () => {
  try {
    const response = await apiClient.get("/schedule");
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }

};

export const getHouseSchedule = async ({ siteLocation, houseType, purpose }) => {
  try {
    const response = await apiClient.get("/houseschedule", {
      params: { siteLocation, houseType, purpose },
    });
    return response.data.data; //return only the array
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
// export const getHouseSchedule = async ({ siteLocation, houseType, purpose }) => {
//   try {
//     const response = await apiClient.get("/houseschedule", {
//       params: { siteLocation, houseType, purpose },
//     });
//     console.log(response)
//     return response.data;
//   } catch (error) {
//     console.error("API Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

export const viewHouseSchedule = async (params) => {
  try {
    const response = await apiClient.get("/houseschedule", { params });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Throw the actual error, not a generic message
  }

};





export default apiClient;
