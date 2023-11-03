import React, { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddDeductions = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("deduction_code", values.deduction_code);
      formData.append("deduction_name", values.deduction_name);
      formData.append("deduction_status", values.deduction_status);

      const postDataUrl = "/deduction/add";

      const navigatePath = "/ManageDeductions";
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
      const isAddPermissionAvailable =
        permissionsArray?.includes("deduction-create");

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
              <h1 className="page-title">Add Deductions</h1>

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
                  Manage Deductions
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Deductions</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    deduction_name: "",
                    deduction_code: "",
                    deduction_status: "1",
                  }}
                  validationSchema={Yup.object({
                    deduction_name: Yup.string()
                    .required(" Deduction Name is required"),

                    deduction_code: Yup.string()
                      .required("Deduction Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message:
                          "Deduction Code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message:
                            "Deduction Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    deduction_status: Yup.string().required(
                      "Deduction Status is required"
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
                                htmlFor="deduction name"
                              >
                                Deduction Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${
                                  errors.deduction_name &&
                                  touched.deduction_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="deduction_name"
                                name="deduction_name"
                                placeholder="Deduction Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="deduction_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="deduction_code"
                              >
                                Deduction Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.deduction_code &&
                                  touched.deduction_code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="deduction_code"
                                name="deduction_code"
                                placeholder="Deduction Code"
                              />
                              <ErrorMessage
                                name="deduction_code"
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
                                htmlFor="deduction_status"
                              >
                                Deduction Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.deduction_status &&
                                  touched.deduction_status
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="deduction_status"
                                name="deduction_status"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="deduction_status"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managedeductions/`}
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
export default withApi(AddDeductions);
