import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";

const EditCompany = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );


  const [dropdownValue, setDropdownValue] = useState([]);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const Company_Client_id = localStorage.getItem("Company_Client_id");
    const Company_id = localStorage.getItem("Company_id");

    const formData = new FormData();

    formData.append("client_id", Company_Client_id);
    formData.append("company_id", Company_id);

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post("/company/detail", formData);
        if (response) {
          formik.setValues(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

    try {
      fetchData();
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    console.clear();
  }, []);
  useEffect(() => {
    if (localStorage.getItem("superiorRole") !== "Client") {
      // Call the fetchClientList() function
      handleFetchData();
    }

    console.clear();
    console.clear();
  }, []);
  const token = localStorage.getItem("token");

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/list");

      if (response && response.data && response.data.data) {
        setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    const Company_id = localStorage.getItem("Company_id");
    const formData = new FormData();

    // Iterate over formik.values and convert null to empty strings
    for (const [key, value] of Object.entries(formik.values)) {
      const convertedValue = value === null ? "" : value;
      formData.append(key, convertedValue);
    }
    formData.append("company_id", Company_id);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        SuccessAlert(data.message);
        navigate("/managecompany");
      } else {
        ErrorAlert(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      company_code: "",
      company_name: "",

      address: "",

      // financial_start_month: "",

      website: "",

      client_id: "",
      company_details: "",
    },
    validationSchema: Yup.object({
      company_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Company Code is required"),
      company_details: Yup.string().required("Company Details is required"),
      company_name: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Company Name is required"),

      address: Yup.string().required("Address is required"),

      website: Yup.string().required("website is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Company</h1>

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
                  linkProps={{ to: "/managecompany" }}
                >
                  Manage Company
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Company
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Company</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="company_code"
                          >
                            Company Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="company_code"
                            name="company_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.company_code &&
                              formik.touched.company_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Company Code"
                            onChange={formik.handleChange}
                            value={formik.values.company_code || ""}
                          />
                          {formik.errors.company_code &&
                            formik.touched.company_code && (
                              <div className="invalid-feedback">
                                {formik.errors.company_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="company_name"
                          >
                            Company Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.company_name &&
                              formik.touched.company_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="company_name"
                            name="company_name"
                            placeholder="Company Name"
                            onChange={formik.handleChange}
                            value={formik.values.company_name || ""}
                          />
                          {formik.errors.company_name &&
                            formik.touched.company_name && (
                              <div className="invalid-feedback">
                                {formik.errors.company_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <label
                          htmlFor="company_details"
                          className="form-label mt-4"
                        >
                          Company Details<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.company_details &&
                            formik.touched.company_details
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_details"
                          name="company_details"
                          placeholder=" Company Details"
                          onChange={formik.handleChange}
                          value={formik.values.company_details || ""}
                        />
                        {formik.errors.company_details &&
                          formik.touched.company_details && (
                            <div className="invalid-feedback">
                              {formik.errors.company_details}
                            </div>
                          )}
                      </Col>
                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="client_id"
                              className="form-label mt-4"
                            >
                              Client <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${formik.errors.client_id &&
                                formik.touched.client_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="client_id"
                              name="client_id"
                              onChange={formik.handleChange}
                              value={formik.values.client_id}
                            >
                              <option value=""> Select Client</option>
                              {dropdownValue.clients &&
                                dropdownValue.clients.length > 0 ? (
                                dropdownValue.clients.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.client_name}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No clients</option>
                              )}
                            </select>
                            {formik.errors.client_id &&
                              formik.touched.client_id && (
                                <div className="invalid-feedback">
                                  {formik.errors.client_id}
                                </div>
                              )}
                          </div>
                        </Col>
                      )}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="address" className="form-label mt-4">
                            Address<span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`input101 ${formik.errors.address && formik.touched.address
                              ? "is-invalid"
                              : ""
                              }`}
                            id="address"
                            name="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address || ""}
                            placeholder=" Address"
                          />
                          {formik.errors.address && formik.touched.address && (
                            <div className="invalid-feedback">
                              {formik.errors.address}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="website" className="form-label mt-4">
                            Website
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.website && formik.touched.website
                              ? "is-invalid"
                              : ""
                              }`}
                            id="website"
                            name="website"
                            placeholder="website"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.website || ""}
                          />
                          {formik.errors.website && formik.touched.website && (
                            <div className="invalid-feedback">
                              {formik.errors.website}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="sussbmit"
                        className="btn btn-danger me-2 "
                        to={`/managecompany/`}
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
export default withApi(EditCompany);
