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
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddAddon = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("business_name", values.business_name);
      formData.append("slug", values.slug);
      formData.append("status", values.status);

      const postDataUrl = "/business/add-type";
      const navigatePath = "/business";

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
        "business-type-create"
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Business Type Name</h1>

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
                  Manage Business
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Business Type Name</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    business_name: "",
                    slug: "",

                    status: "1",
                  }}
                  validationSchema={Yup.object({
                    business_name: Yup.string()
                    .required(" Business Type Name is required"),

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

                    status: Yup.string().required("Status is required"),
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
                                Business Type Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${
                                  errors.business_name && touched.business_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="business_name"
                                name="business_name"
                                placeholder="Business Type Name"
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
                                htmlFor="slug"
                              >
                                Slug
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.slug && touched.slug
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="slug"
                                name="slug"
                                placeholder="Slug"
                              />
                              <ErrorMessage
                                name="slug"
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
                                className={`input101 ${
                                  errors.status && touched.status
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
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/business/`}
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
export default withApi(AddAddon);
