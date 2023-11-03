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
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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
    const url = "/business/category/detail";
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

  useEffect(() => {
    console.log(id);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const GetSiteData = async () => {
      try {
        const response = await axiosInstance.get("business/types");
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

      formData.append("category_name", values.category_name);
      formData.append("code", values.category_code);
      formData.append("status", values.category_status);
      formData.append("id", id);
      formData.append("business_type_id", values.business_type_id);
      console.log(values);

      const postDataUrl = "/business/category/update";
      const navigatePath = "/managebusinesscategory";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      category_name: "",
      category_code: "",
      business_type_id: "",
      category_status: "1",
    },
    validationSchema: Yup.object({
      category_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Business Category is required"),

      category_code: Yup.string()
        .required("Code is required")
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

      business_type_id: Yup.string().required(
        "Business Category Type is required"
      ),
      category_status: Yup.string().required("Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name
  const inputClass = `form-control ${isInvalid}`;
  const handleBusinessTypeChange = (e) => {
    const selectedType = e.target.value;

    formik.setFieldValue("business_type", selectedType);
    setSelectedBusinessType(selectedType);
    const selectedTypeData = AddSiteData.business_types.find(
      (type) => type.name === selectedType
    );
    setSubTypes(selectedTypeData.sub_types);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Business Category</h1>

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
                  Manage Business Category
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Business Category
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Business Category</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="category_name"
                          >
                            Business Category Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="category_name"
                            category_name="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.category_name &&
                              formik.touched.category_name
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Business Category Name"
                            onChange={formik.handleChange}
                            value={formik.values.category_name || ""}
                          />
                          {formik.errors.category_name &&
                            formik.touched.category_name && (
                              <div className="invalid-feedback">
                                {formik.errors.category_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="category_code"
                          >
                            Business Category Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="category_code"
                            code="category_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.category_code &&
                              formik.touched.category_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Business Category Code"
                            onChange={formik.handleChange}
                            value={formik.values.category_code}
                            readOnly
                          />
                          {formik.errors.category_code &&
                            formik.touched.category_code && (
                              <div className="invalid-feedback">
                                {formik.errors.category_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="category_status"
                            className="form-label mt-4"
                          >
                            Status <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.category_status &&
                              formik.touched.category_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="category_status"
                            name="category_status"
                            onChange={formik.handleChange}
                            value={formik.values.category_status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.category_status &&
                            formik.touched.category_status && (
                              <div className="invalid-feedback">
                                {formik.errors.category_status}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="business_type_id"
                            className=" form-label mt-4"
                          >
                            Select Business Type
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.business_type_id &&
                              formik.touched.business_type_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="business_type_id"
                            name="business_type_id"
                            onChange={formik.handleChange}
                            value={formik.values.business_type_id}
                          >
                            <option value=""> Select Business Type</option>
                            {AddSiteData.data ? (
                              AddSiteData.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.business_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Machine Type</option>
                            )}
                          </select>
                          {formik.errors.business_type_id &&
                            formik.touched.business_type_id && (
                              <div className="invalid-feedback">
                                {formik.errors.business_type_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managebusinesscategory/`}
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
