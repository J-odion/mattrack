import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5001/api", // Backend URL
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

    console.log("Registration Success:", response.data.user , "testing");

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

    console.log("Uploading Successful:", response.data , "testing");

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Data uploading failed. Please try again.");
  }
};

export const addDisbursedData = async (credentials) => {
  try {
    const response = await apiClient.post("/disburseddata", credentials);

    console.log("Uploading Successful:", response.data , "testing");

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Data uploading failed. Please try again.");
  }
};

export const fetchDisbursedData = async () => {
  try {
    const response = await apiClient.get("/disburseddata"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
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





export default apiClient;
