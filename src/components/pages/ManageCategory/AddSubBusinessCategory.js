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

const AddSubBusinessCategory = (props) => {
  const { isLoading, postData } = props;

  const navigate = useNavigate();
  const [AddSiteData, setAddSiteData] = useState([]);

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("sub_category_name", values.sub_category_name);
      formData.append("code", values.code);
      formData.append("status", values.status);
      formData.append("business_category_id", values.business_category_id);

      const postDataUrl = "/business/subcategory/add";
      const navigatePath = "/managesubbusinesscategory";

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
      // navigate("/login");
      // ErrorAlert("Invalid access token");
      // localStorage.clear();
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
        const response = await axiosInstance.get("business/category");
        setAddSiteData(response.data);
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, []);
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Sub-Business Category</h1>

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
                  Manage Sub-Business Category
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Sub-Business Category</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    sub_category_name: "",
                    code: "",
                    business_category_id: " ",
                    status: "1",
                  }}
                  validationSchema={Yup.object({
                    sub_category_name: Yup.string().required(
                      " Sub-Business Category Name is required"
                    ),

                    code: Yup.string()
                      .required("Sub-Business Category Code  is required")
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
                    business_category_id: Yup.string().required(
                      "Sub-Business Category Type is required"
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
                                htmlFor="sub_category_name"
                              >
                                Sub-Business Category Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${errors.sub_category_name &&
                                  touched.sub_category_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="sub_category_name"
                                name="sub_category_name"
                                placeholder="Sub-Business Category Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="sub_category_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="code"
                              >
                                Sub-Business Category Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.code && touched.code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="code"
                                name="code"
                                placeholder="Sub-Business Category Code"
                              />
                              <ErrorMessage
                                name="code"
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
                                name="Status"
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
                                htmlFor="business_category_id"
                                className=" form-label mt-4"
                              >
                                Select Business Category
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.business_category_id &&
                                  touched.business_category_id
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="business_category_id"
                                name="business_category_id"
                              >
                                <option value="">
                                  {" "}
                                  Select Business Category
                                </option>
                                {AddSiteData.data ? (
                                  AddSiteData.data.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.category_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Sub-Business Type</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="business_category_id"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managesubbusinesscategory/`}
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
export default withApi(AddSubBusinessCategory);
