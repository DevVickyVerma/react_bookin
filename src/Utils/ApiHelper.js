import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const withApi = (WrappedComponent) => {
  const WithApi = (props) => {
    const [apidata, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const SuccessToast = (message) => {
      toast.success(message, {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        transition: Slide,
        autoClose: 1000,
        theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
      });
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
    function handleError(error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorToast("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else if (error.response && error.response.data.message) {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(" ")
          : error.response.data.message;

        if (errorMessage) {
          ErrorToast(errorMessage);
        }
      } else {
        ErrorToast("An error occurred.");
      }
    }
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const getData = async (url, id, formData) => {
      try {
        setIsLoading(true);
        const modifiedUrl = id ? `${url}/${id}` : url; // Append the ID to the URL if it exists
        const response = await axiosInstance.get(modifiedUrl, {
          params: formData,
        });

        if (response && response.data) {
          const data = response.data;
          setApiData(data);
          setIsLoading(false);
          return response; // Return the response 
        } else {
          throw new Error("Invalid response"); // Handle the case where the response or response.data is undefined
        }
      } catch (error) {
        handleError(error);
        setError(error);
        setIsLoading(false);
        throw error; // Throw the error to handle it in the calling function
      }
    };

    const postData = async (url, body, navigatePath) => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.post(url, body);
        if (response && response.data) {
          const data = response.data;

          setApiData(data);
          SuccessToast(data.message);
          setIsLoading(false);
          navigate(navigatePath);
          return data;
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        handleError(error);
        setError(error);
        setIsLoading(false);
      }
    };

    return (
      <WrappedComponent
        apidata={apidata}
        isLoading={isLoading}
        error={error}
        getData={getData}
        postData={postData}
        {...props}
      />
    );
  };

  return WithApi;
};

export default withApi;
