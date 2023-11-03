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
import { FileInput, ImageInput } from "formik-file-and-image-input/lib";

const AddCards = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const imageFormats = ["image/png", "image/svg", "image/jpeg"];
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit1 = async (values) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("card_name", values.card_name);
      formData.append("card_code", values.card_code);
      formData.append("card_status", values.card_status);
      formData.append("is_bunkering", values.is_bunkering);
      formData.append("logo", values.image);

      const postDataUrl = "card/add";

      const navigatePath = "/ManageCards";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const navigate = useNavigate();
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
        permissionsArray?.includes("card-create");

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      }
      // else {
      //   navigate("/errorpage403");
      // }
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
              <h1 className="page-title">Add Cards</h1>

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
                  Manage Cards
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Cards</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    card_name: "",
                    card_code: "",
                    card_status: "1",
                    is_bunkering: "0",
                    image: null,
                  }}
                  validationSchema={Yup.object({
                    card_name: Yup.string()
                      .required(" Card Name is required"),

                    card_code: Yup.string()
                      .required("Card Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message:
                          "Card Code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message: "Card Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    card_status: Yup.string().required(
                      "Card Status is required"
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
                              <label
                                className=" form-label mt-4"
                                htmlFor="card_name"
                              >
                                Card Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${errors.card_name && touched.card_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="card_name"
                                name="card_name"
                                placeholder="Card Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="card_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="card_code"
                              >
                                Card Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.card_code && touched.card_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="card_code"
                                name="card_code"
                                placeholder="Card Code"
                              />
                              <ErrorMessage
                                name="card_code"
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
                                htmlFor="card_status"
                              >
                                Card Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.card_status && touched.card_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="card_status"
                                name="card_status"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="card_status"
                              />
                            </FormGroup>
                          </Col>
                          {/* IS Bunkering Section Start */}
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="is_bunkering"
                              >
                                Bunkering Status
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.is_bunkering && touched.is_bunkering
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="is_bunkering"
                                name="is_bunkering"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="is_bunkering"
                              />
                            </FormGroup>
                          </Col>
                          {/* IS Bunkering Section End */}
                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label
                                className=" form-label mt-4"
                                htmlFor="image"
                              >
                                Card Logo
                              </label>
                              <div
                                className={`dropzone ${errors.image && touched.image
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
                                  Drag and drop your Card Logo here, or click to
                                  browse
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
                          to={`/manageCards/`}
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
export default withApi(AddCards);
