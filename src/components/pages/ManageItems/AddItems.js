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

const AddItems = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [selectedItemTypeList, setselectedItemTypeList] = useState([]);

  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("sage_purchase_code", values.sage_purchase_code);
      formData.append("item_type_id", values.item_type_id);

      const postDataUrl = "/department-item/add";

      const navigatePath = "/manageItems";
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

  const handleItemData = async () => {
    try {
      const response = await getData("/item-type/list");

      const { data } = response;
      if (data) {
        setselectedItemTypeList(response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    handleItemData();
    console.clear();
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Items</h1>

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
                  Manage Items
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Items</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    name: "",
                    code: "",
                    sage_purchase_code: "",
                    item_type_id: "",
                    status: "1",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().required(" Site Item Name is required"),

                    code: Yup.string()
                      .required("Site Item Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message:
                          "Item Category Code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message:
                            "Site Item Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    status: Yup.string().required(
                      "Site Item Status is required"
                    ),
                    item_type_id: Yup.string().required(
                      "Item Type is required"
                    ),

                    sage_purchase_code: Yup.string()
                      .required("Sage Purchase Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message:
                          "Item Code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message: "Item Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
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
                                htmlFor="item_type_id"
                                className="form-label mt-4"
                              >
                                Item Type
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.item_type_id && touched.item_type_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="item_type_id"
                                name="item_type_id"
                              >
                                <option value="">Select a Item Type</option>
                                {selectedItemTypeList.length > 0 ? (
                                  selectedItemTypeList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.item_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Item Type</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="item_type_id"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="code"
                              >
                                Item Category Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.code && touched.code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="code"
                                name="code"
                                placeholder="Item Category Code"
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
                                htmlFor="sage_purchase_code"
                              >
                                Sage Purchase Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.sage_purchase_code &&
                                  touched.sage_purchase_code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="sage_purchase_code"
                                name="sage_purchase_code"
                                placeholder="Sage Purchase Code"
                              />
                              <ErrorMessage
                                name="sage_purchase_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="name"
                              >
                                Site Item Name
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${
                                  errors.name && touched.name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="name"
                                name="name"
                                placeholder="Site Item Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="name"
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
                                Site Item Status
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
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/manageitems/`}
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
export default withApi(AddItems);
