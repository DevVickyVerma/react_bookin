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
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const EditBussiness = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [dropdownValue, setDropdownValue] = useState([]);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      // navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("id", id); // Use the retrieved ID from the URL

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const GetSiteData = async () => {
      try {
        const response = await axiosInstance.get("business/category");
        setAddSiteData(response.data);
        // if (response.data) {
        //   setAddSiteData(response.data.data);
        // }
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    console.clear();
  }, []);

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
    try {
      const response = await getData(`/business/subcategory/detail/${id}`);

      if (response) {
        formik.setValues(response?.data?.data);

        setDropdownValue(response?.data?.data);
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

      formData.append("sub_category_name", values.sub_category_name);
      formData.append("code", values.sub_category_code);
      formData.append("status", values.status);
      formData.append("id", id);
      formData.append("business_category_id", values.business_category_id);
      console.log(values);

      const postDataUrl = "/business/subcategory/update";
      const navigatePath = "/managesubbusinesscategory";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      sub_category_name: "",
      sub_category_code: "",
      business_category_id: "",
      business_category_id: " ",
      status: "1",
    },
    validationSchema: Yup.object({
      sub_category_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Sub-Business Category Name is required"),

      sub_category_code: Yup.string()
        .required("Sub-Business Category Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Code must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Code must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      business_category_id: Yup.string().required(
        "Sub-Business Category Type is required"
      ),
      status: Yup.string().required("Status is required"),
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
              <h1 className="page-title">Edit Sub-Business Category</h1>

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
                  linkProps={{ to: "/business" }}
                >
                  Manage Sub-Business Category
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Sub-Business Category
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Sub-Business Category</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="sub_category_name"
                          >
                            Sub-Business Category Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sub_category_name"
                            sub_category_name="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.sub_category_name &&
                              formik.touched.sub_category_name
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Sub-Business Category Name"
                            onChange={formik.handleChange}
                            value={formik.values.sub_category_name || ""}
                          />
                          {formik.errors.sub_category_name &&
                            formik.touched.sub_category_name && (
                              <div className="invalid-feedback">
                                {formik.errors.sub_category_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="sub_category_code"
                          >
                            Sub-Business Category Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sub_category_code"
                            code="sub_category_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.sub_category_code &&
                              formik.touched.sub_category_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Sub-Business Category Code"
                            onChange={formik.handleChange}
                            value={formik.values.sub_category_code}
                            readOnly
                          />
                          {formik.errors.sub_category_code &&
                            formik.touched.sub_category_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sub_category_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
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
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="business_category_id"
                            className=" form-label mt-4"
                          >
                            Select Business Category
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.business_category_id &&
                              formik.touched.business_category_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="business_category_id"
                            name="business_category_id"
                            onChange={formik.handleChange}
                            value={formik.values.business_category_id}
                          >
                            <option value=""> Select Business Category</option>
                            {AddSiteData.data ? (
                              AddSiteData.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.category_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Sub-Business Type</option>
                            )}
                          </select>
                          {formik.errors.business_category_id &&
                            formik.touched.business_category_id && (
                              <div className="invalid-feedback">
                                {formik.errors.business_category_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managesubbusinesscategory/`}
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
export default withApi(EditBussiness);
