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

const EditItems = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [selectedItemTypeList, setselectedItemTypeList] = useState([]);


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
    try {
      const response = await getData(`/department-item/${id}`);

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

      formData.append("id", values.id);
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("item_type_id", values.item_type_id);
      formData.append("sage_purchase_code", values.sage_purchase_code);

      const postDataUrl = "/department-item/update";
      const navigatePath = "/manageitems";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      item_type_id: "",
      name: "",
      sage_purchase_code: "",
      status: "1",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Item code is required"),

      name: Yup.string()
        .required("Item Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Item Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Item Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),
      item_type_id: Yup.string().required("Item Type is required"),
      sage_purchase_code: Yup.string()
        .required("Sage Purchase Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Item Code must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Item Code must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Items</h1>

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
                  linkProps={{ to: "/manageItems" }}
                >
                  Manage Items
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Items
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Items</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="name">
                            Item Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.name && formik.touched.name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="name"
                            name="name"
                            placeholder="Item Name"
                            onChange={formik.handleChange}
                            value={formik.values.name || ""}
                          />
                          {formik.errors.name && formik.touched.name && (
                            <div className="invalid-feedback">
                              {formik.errors.name}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="item_type_id"
                            className="form-label mt-4"
                          >
                            Select Item Type
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.item_type_id &&
                              formik.touched.item_type_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="item_type_id"
                            name="item_type_id"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.item_type_id}
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
                          </select>
                          {formik.errors.item_type_id &&
                            formik.touched.item_type_id && (
                              <div className="invalid-feedback">
                                {formik.errors.item_type_id}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="code">
                            Item Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.code && formik.touched.code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Item Code"
                            onChange={formik.handleChange}
                            value={formik.values.code || ""}
                            readOnly
                          />
                          {formik.errors.code && formik.touched.code && (
                            <div className="invalid-feedback">
                              {formik.errors.code}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="status">
                            Item Status <span className="text-danger">*</span>
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
                            className=" form-label mt-4"
                            htmlFor="sage_purchase_code"
                          >
                            Saga Purchase Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sage_purchase_code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101  ${formik.errors.sage_purchase_code &&
                              formik.touched.sage_purchase_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Saga Purchase Code"
                            onChange={formik.handleChange}
                            value={formik.values.sage_purchase_code || ""}
                          />
                          {formik.errors.sage_purchase_code &&
                            formik.touched.sage_purchase_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sage_purchase_code}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/manageitems/`}
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
export default withApi(EditItems);
