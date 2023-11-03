// toastUtils.js
import { Slide, toast } from "react-toastify";
const SuccessAlert = (message) => {
    toast.success(message, {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        transition: Slide,
        theme: "colored",
    });
};

const ErrorAlert = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        transition: Slide,
        autoClose: 1000,
        theme: "colored",
    });
};

const handleError = (error, navigate) => {
    if (error.response && error.response.status === 401) {
        navigate("/login");
        SuccessAlert("Invalid access token");
        localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
    } else {
        const errorMessage = Array.isArray(error.response?.data?.message)
            ? error.response?.data?.message.join(" ")
            : error.response?.data?.message;
        ErrorAlert(errorMessage);
    }
};

export { SuccessAlert, ErrorAlert, handleError };
