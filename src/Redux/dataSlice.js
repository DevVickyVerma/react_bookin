import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { ErrorAlert } from "../Utils/ToastUtils";

// Define the initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};

const ErrorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true,
    transition: Slide,
    autoClose: 1000,
    theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
  });
};
// Create an asynchronous thunk to fetch the API data
const baseUrl = process.env.REACT_APP_BASE_URL;
export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    try {
      const response = await axios.get(`${baseUrl}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data) {
        localStorage.setItem("superiorId", data?.data?.superiorId);
        localStorage.setItem("superiorRole", data?.data?.superiorRole);
        localStorage.setItem("role", data?.data?.role);
        localStorage.setItem("auto_logout", data?.data?.auto_logout);
        localStorage.setItem("two_factor", data?.data?.two_factor);
      }

      // Check the structure of the data
      return data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response) {
          if (response.status === 401) {
            setTimeout(function () {
              window.location.replace("/login");
              ErrorToast("Invalid access token");
              localStorage.clear();
            }, 2000); // 1000 milliseconds = 1 second
          } else if (response.status === 403) {
          } else if (response.data && response.data.message) {
            const errorMessage = Array.isArray(response.data.message)
              ? response.data.message.join(" ")
              : response.data.message;

            if (errorMessage) {
              ErrorToast(errorMessage);
            }
          } else {
            // Unknown error
            ErrorToast("An error occurred.");
          }
        } else {
          // Network error or other issues
          ErrorToast("Failed to fetch data from API.");
        }
      } else {
        // Non-Axios error
        console.error(error);
        window.location.replace("/under-construction")
        ErrorAlert(error.message);
        throw new Error("An error occurred.");
      }
    }
  }
);

// Create the data slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action and reducer
export const dataActions = dataSlice.actions;
export default dataSlice.reducer;
