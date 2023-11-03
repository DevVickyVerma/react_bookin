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
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";

export default function AddSite() {
  const navigate = useNavigate();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState();
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
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("id", id); // Use the retrieved ID from the URL

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/business/sub-type/${id}`);
        if (response) {
          setEditSiteData(response.data.data);
          formik.setValues(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

    try {
      fetchData();
      fetchClientList();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);
  const fetchClientList = async () => {
    try {
      const response = await axiosInstance.get("/business/types");

      if (response) {
        // setData(response.data.data.sites);

        setDropdownValue(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
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
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("business_sub_name", values.business_sub_name);
    formData.append("slug", values.slug);
    formData.append("status", values.status);
    formData.append("business_type_id", values.business_type_id);
    formData.append("id", values.id);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/business/update-sub-type`,
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
        navigate("/sub-business");
      } else {
        ErrorAlert(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      business_sub_name: "",
      slug: "",

      status: "1",
      business_type_id: "",
    },
    validationSchema: Yup.object({
      business_sub_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Company Code is required"),

      business_type_id: Yup.string().required("status is required"),

      slug: Yup.string()
        .required("Slug is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Slug must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Slug must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required("Client is required"),
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
    const selectedTypeData = AddSiteData.busines_types.find(
      (type) => type.name === selectedType
    );
    setSubTypes(selectedTypeData.sub_types);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Sub-Business</h1>

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
              linkProps={{ to: "/sub-business" }}
            >
              Manage Sub-Business
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Sub-Business
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Sub-Business</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label
                        className="form-label mt-4"
                        htmlFor="business_sub_name"
                      >
                        Business Name<span className="text-danger">*</span>
                      </label>
                      <input
                        id="business_sub_name"
                        business_sub_name="name"
                        type="text"
                        autoComplete="off"
                        className={`input101 ${formik.errors.business_sub_name &&
                          formik.touched.business_sub_name
                          ? "is-invalid"
                          : ""
                          }`}
                        placeholder="Business Name"
                        onChange={formik.handleChange}
                        value={formik.values.business_sub_name || ""}
                      />
                      {formik.errors.business_sub_name &&
                        formik.touched.business_sub_name && (
                          <div className="invalid-feedback">
                            {formik.errors.business_sub_name}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="slug">
                        Slug<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        className={`input101 ${formik.errors.slug && formik.touched.slug
                          ? "is-invalid"
                          : ""
                          }`}
                        id="slug"
                        name="slug"
                        placeholder="Slug"
                        onChange={formik.handleChange}
                        value={formik.values.slug || ""}
                      />
                      {formik.errors.slug && formik.touched.slug && (
                        <div className="invalid-feedback">
                          {formik.errors.slug}
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
                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="business_type_id"
                        className=" form-label mt-4"
                      >
                        Business Type <span className="text-danger">*</span>
                      </label>
                      <select
                        as="select"
                        className={`input101 ${formik.errors.business_type_id &&
                          formik.errors.business_type_id
                          ? "is-invalid"
                          : ""
                          }`}
                        id="business_type_id"
                        name="business_type_id"
                        onChange={formik.handleChange}
                        value={formik.values.business_type_id}
                      >
                        <option value=""> Select Business Type</option>
                        {dropdownValue.data && dropdownValue.data.length > 0 ? (
                          dropdownValue.data.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.business_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Business Type</option>
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
                    to={`/sub-business/`}
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
  );
}
