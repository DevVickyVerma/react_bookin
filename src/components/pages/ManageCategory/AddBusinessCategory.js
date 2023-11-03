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
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const AddBusinessCategory = (props) => {
  const { isLoading, error, getData, postData } = props;

  const navigate = useNavigate();
  const [AddSiteData, setAddSiteData] = useState([]);

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("category_name", values.business_name);
      formData.append("code", values.business_category_code);
      formData.append("status", values.status);
      formData.append("business_type_id", values.business_type_id);

      const postDataUrl = "/business/category/add";
      const navigatePath = "/managebusinesscategory";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
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
      const isAddPermissionAvailable = permissionsArray?.includes(
        "business-category-create"
      );

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
  function handleError(error) {
    if (error.response && error.response.status === 401) {
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
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Business Category</h1>

              <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{ to: "/dashboard" }}
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Manage Business Category
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Business Category</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    business_name: "",
                    business_category_code: "",
                    business_type_id: " ",
                    status: "1",
                  }}
                  validationSchema={Yup.object({
                    business_name: Yup.string().required(
                      " Business Category Name is required"
                    ),

                    business_category_code: Yup.string()
                      .required("Business Category Code  is required")
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

                    status: Yup.string().required("Status is required"),
                    business_type_id: Yup.string().required(
                      "Business Category Type is required"
                    ),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="business_name"
                              >
                                Business Category Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${errors.business_name && touched.business_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="business_name"
                                name="business_name"
                                placeholder="Business Category Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="business_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="business_category_code"
                              >
                                Business Category Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.business_category_code &&
                                  touched.business_category_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="business_category_code"
                                name="business_category_code"
                                placeholder="Business Category Code"
                              />
                              <ErrorMessage
                                name="business_category_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="status"
                              >
                                Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.status && touched.status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="status"
                                name="status"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="status"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                htmlFor="business_type_id"
                                className=" form-label mt-4"
                              >
                                Select Business Type
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.business_type_id &&
                                  touched.business_type_id
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="business_type_id"
                                name="business_type_id"
                              >
                                <option value=""> Select Business Type</option>
                                {AddSiteData.data ? (
                                  AddSiteData.data.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.business_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Business Type</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="business_type_id"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managebusinesscategory/`}
                        >
                          Cancel
                        </Link>
                        <button className="btn btn-primary me-2" type="submit">
                          Add
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
export default withApi(AddBusinessCategory);
