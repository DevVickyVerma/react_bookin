import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Loaderimg from "../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

export function FormModal(props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleSubmit1 = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("site_id", props.PropsSiteId);
    formData.append("company_id", props.PropsCompanyId);
    formData.append("client_id", props.selectedClientId);
    formData.append("type", props.PropsFile);
    formData.append("file", values.image);

    setIsLoading(true);

    try {
      let url;

      if (props.PropsFile === "sales") {
        url = `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-prism-sales`;
      } else if (props.PropsFile === "payments") {
        url = `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-prism-payments`;
      } else if (props.PropsFile === "paid") {
        url = `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-prism-paid`;
      } else if (props.PropsFile === "tanks") {
        url = `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-prism-tanks`;
      } else if (props.PropsFile === "vat") {
        url = `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-prism-vat`;
      } else {
        // Default URL if none of the conditions are met
        url = "http://example.com/default-upload";
      }
      const response = await await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Add Content-Type header if necessary:
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        SuccessToast(data.message);

        handleClose();
      } else {
        const errorData = await response.json();
        ErrorToast(errorData.message);
        handleClose();
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event, setFieldValue) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setFieldValue("image", file);

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <Button
          className="modal-effect d-grid mb-3 upload-btn"
          // href={`#${props.modalId}`}
          variant="danger"
          onClick={handleClickOpen}
        >
          <div className="d-flex">
            <h4 class="card-title">
              {" "}
              {props.modalTitle}
              <span>
                <UploadFileIcon />
              </span>
            </h4>
          </div>
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {props.modalTitle}
            <Button onClick={handleClose} className="btn-close" variant="">
              x
            </Button>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{props.modalContentText}</DialogContentText>

            <Formik
              initialValues={{
                image: null,
              }}
              validationSchema={Yup.object().shape({
                image: Yup.mixed()
                  .required("File is required")
                  .test("fileType", "Invalid file type", (value) => {
                    if (value) {
                      const allowedFileTypes = [
                        "text/csv",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      ];
                      return allowedFileTypes.includes(value.type);
                    }
                    return true;
                  }),
              })}
              onSubmit={(values) => {
                handleSubmit1(values);
              }}
            >
              {({ handleSubmit, errors, touched, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <div
                      className={`dropzone ${
                        errors.image && touched.image ? "is-invalid" : ""
                      }`}
                      onDrop={(event) => handleDrop(event, setFieldValue)}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={(event) =>
                          handleImageChange(event, setFieldValue)
                        }
                        className="form-control"
                      />
                      <p>Upload image here, or click to browse</p>
                    </div>
                    <ErrorMessage
                      component="div"
                      className="invalid-feedback"
                      name="image"
                    />
                  </div>

                  <div className="text-end">
                    <button className="btn btn-primary me-2 " type="submit">
                      Upload
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
