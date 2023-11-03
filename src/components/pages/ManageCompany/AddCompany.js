import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const AddCompany = (props) => {
  const { isLoading, postData } = props;

  const navigate = useNavigate();
  const [dropdownValue, setDropdownValue] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

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
    if (localStorage.getItem("superiorRole") !== "Client") {
      // Call the fetchClientList() function
      fetchClientList();
    }

    console.clear();
  }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchClientList = async () => {
    try {
      const response = await axiosInstance.get("/client/list");

      if (response.data.data.clients.length > 0) {
        // setData(response.data.data.sites);

        setDropdownValue(response.data.data);
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

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("website", values.website);
      formData.append("company_name", values.company_name);
      formData.append("company_details", values.company_details);
      formData.append("company_code", values.company_code);
      formData.append("address", values.address);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      const postDataUrl = "/company/create";
      const navigatePath = "/managecompany";

      await postData(postDataUrl, formData, navigatePath);

      setSubmitting(false); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error);
      setSubmitting(false); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  useEffect(() => {
    if (isPermissionsSet) {
      const isAddPermissionAvailable =
        permissionsArray?.includes("company-create");

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Company</h1>

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
                  Add Company
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Company</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    company_code: "",
                    company_name: "",

                    address: "",

                    // financial_start_month: "",

                    website: "",

                    client_id: "",
                    company_details: "",
                  }}
                  validationSchema={Yup.object({
                    company_code: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("Company Code is required"),
                    company_details: Yup.string().required(
                      "Company Details is required"
                    ),
                    company_name: Yup.string()
                      .max(100, "Must be 100 characters or less")
                      .required("Company Name is required"),

                    address: Yup.string().required("Address is required"),

                    website: Yup.string().required("website is required"),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSubmit1(values, setSubmitting);
                  }}
                >
                  {({
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className="form-label mt-4"
                                htmlFor="company_code"
                              >
                                Company Code
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.company_code && touched.company_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_code"
                                name="company_code"
                                placeholder="Company Code"
                              />
                              <ErrorMessage
                                name="company_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="company_name"
                              >
                                Company Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.company_name && touched.company_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_name"
                                name="company_name"
                                placeholder="Company Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="address "
                                className=" form-label mt-4"
                              >
                                Address<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                type="textarea"
                                className={`input101 ${errors.address && touched.address
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="address"
                                name="address"
                                placeholder="Address"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="address"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="website "
                                className=" form-label mt-4"
                              >
                                Website<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.website && touched.website
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="website"
                                name="website"
                                placeholder="Website"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="website"
                              />
                            </FormGroup>
                          </Col>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                              <Col lg={4} md={6}>
                                <FormGroup>
                                  <label
                                    htmlFor="client_id"
                                    className=" form-label mt-4"
                                  >
                                    Client<span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    className={`input101 ${errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                      }`}
                                    id="client_id"
                                    name="client_id"
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
                                  </Field>
                                  <ErrorMessage
                                    component="div"
                                    className="invalid-feedback"
                                    name="client_id"
                                  />
                                </FormGroup>
                              </Col>
                            )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_details"
                                className=" form-label mt-4"
                              >
                                Company Details
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                type="textarea"
                                className={`input101 ${errors.company_details &&
                                  touched.company_details
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_details"
                                name="company_details"
                                placeholder="Company Details"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_details"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>

                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managecompany/`}
                        >
                          Cancel
                        </Link>

                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                        // disabled={Object.keys(errors).length > 0}
                        >
                          Save
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
