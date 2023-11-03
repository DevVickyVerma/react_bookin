import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const Editsuppliers = (props) => {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();
  const reader = new FileReader();
  const [previewImage, setPreviewImage] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  function handleError(error) {
    if (error.response && error.response.Status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.Status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }
  const { id } = useParams();

  useEffect(() => {
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);

  const FetchRoleList = async () => {
    const url = `/supplier`;
    try {
      const response = await getData(url, id);

      if (response) {
        formik.setValues(response.data.data);

        setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("supplier_code", values.supplier_code);
      formData.append("supplier_name", values.supplier_name);
      formData.append("status", values.status);
      formData.append("id", values.id);
      formData.append("logo", values.image);

      const postDataUrl = "/supplier/update";
      const navigatePath = "/Managesuppliers";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    // Preview the image

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

  const formik = useFormik({
    initialValues: {
      supplier_code: "",
      supplier_name: "",
      status: "1",
    },
    validationSchema: Yup.object({
      supplier_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Supplier code is required"),

      supplier_name: Yup.string()
        .required("Supplier Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Supplier Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Supplier Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required("Supplier Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Supplier</h1>

              <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{ to: "/dashboard" }}
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item  breadcrumds"
                  aria-current="page"
                  linkAs={Link}
                  linkProps={{ to: "/managesuppliers" }}
                >
                  Manage Supplier
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Supplier
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Supplier</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="supplier_name">
                            Supplier Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.supplier_name &&
                              formik.touched.supplier_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="supplier_name"
                            name="supplier_name"
                            placeholder="Supplier Name"
                            onChange={formik.handleChange}
                            value={formik.values.supplier_name || ""}
                          />
                          {formik.errors.supplier_name &&
                            formik.touched.supplier_name && (
                              <div className="invalid-feedback">
                                {formik.errors.supplier_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="supplier_code">
                            Supplier Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="supplier_code"
                            name="supplier_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.supplier_code &&
                              formik.touched.supplier_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Supplier Code"
                            onChange={formik.handleChange}
                            value={formik.values.supplier_code || ""}
                            readOnly
                          />
                          {formik.errors.supplier_code &&
                            formik.touched.supplier_code && (
                              <div className="invalid-feedback">
                                {formik.errors.supplier_code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="status">
                            Status <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.status && formik.touched.status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="status"
                            name="status"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.status && formik.touched.status && (
                            <div className="invalid-feedback">
                              {formik.errors.status}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label htmlFor="image">Image</label>
                          <div
                            className={`dropzone ${formik.errors.image && formik.touched.image
                              ? "is-invalid"
                              : ""
                              }`}
                            onDrop={(event) =>
                              handleDrop(event, formik.setFieldValue)
                            }
                            onDragOver={(event) => event.preventDefault()}
                          >
                            <input
                              type="file"
                              id="image"
                              name="image"
                              onChange={(event) =>
                                handleImageChange(event, formik.setFieldValue)
                              }
                              className="form-control"
                            />
                            <p>
                              Drag and drop your image here, or click to browse
                            </p>
                          </div>
                          {formik.errors.image && formik.touched.image && (
                            <div className="invalid-feedback">
                              {formik.errors.image}
                            </div>
                          )}
                        </div>
                        {previewImage && (
                          <div>
                            <p>Preview:</p>
                            <img src={previewImage} alt="Preview" />
                          </div>
                        )}
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managesuppliers/`}
                      >
                        Cancel
                      </Link>

                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(Editsuppliers);
