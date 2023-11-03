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

const AddSuppliers = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("supplier_code", values.supplier_code);
      formData.append("supplier_name", values.supplier_name);
      formData.append("status", values.supplier_status);
      formData.append("logo", values.image);

      const postDataUrl = "/supplier/add";

      const navigatePath = "/ManageSuppliers";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
        permissionsArray?.includes("supplier-create");

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
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    // Preview the image
    const reader = new FileReader();
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Suppliers</h1>

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
                  Manage Suppliers
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Suppliers</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    supplier_name: "",
                    supplier_code: "",
                    supplier_status: "1",
                    image: null,
                  }}
                  validationSchema={Yup.object({
                    supplier_name: Yup.string()
                    .required(" Supplier Name is required"),

                    supplier_code: Yup.string()
                      .required("Supplier Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message:
                          "Supplier Code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message:
                            "Supplier Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    supplier_status: Yup.string().required(
                      "Supplier Status is required"
                    ),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label htmlFor="supplier name">
                                Supplier Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                // className="form-control"
                                className={`input101 ${
                                  errors.supplier_name && touched.supplier_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="supplier_name"
                                name="supplier_name"
                                placeholder="Supplier Name"
                                autoComplete="off"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="supplier_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label htmlFor="supplier_code">
                                Supplier Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                className={`input101 ${
                                  errors.supplier_code && touched.supplier_code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="supplier_code"
                                name="supplier_code"
                                placeholder="Supplier Code"
                                autoComplete="off"
                              />
                              <ErrorMessage
                                name="supplier_code"
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
                                htmlFor="supplier_status"
                              >
                                Supplier Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.supplier_status &&
                                  touched.supplier_status
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="supplier_status"
                                name="supplier_status"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="supplier_status"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label
                                className=" form-label mt-4"
                                htmlFor="image"
                              >
                                Supplier Logo
                              </label>
                              <div
                                className={`dropzone ${
                                  errors.image && touched.image
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onDrop={(event) =>
                                  handleDrop(event, setFieldValue)
                                }
                                onDragOver={(event) => event.preventDefault()}
                              >
                                <input
                                  type="file"
                                  id="image"
                                  name="image"
                                  onChange={(event) =>
                                    handleImageChange(event, setFieldValue)
                                  }
                                  className="form-control"
                                />
                                <p style={{ margin: "6px", color: "#4d5875" }}>
                                  Drag and drop your Supplier Logo here, or
                                  click to browse
                                </p>
                              </div>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="image"
                              />
                            </div>
                            {previewImage && (
                              <div>
                                <p>Preview:</p>
                                <img src={previewImage} alt="Preview" />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managesuppliers/`}
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
export default withApi(AddSuppliers);
