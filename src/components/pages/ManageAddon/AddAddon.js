import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Dropdown,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const AddAddon = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [permissions, setPermissions] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);

  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };

  const navigate = useNavigate();
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
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    axiosInstance
      .get("/permission-list")
      .then((response) => {
        setUserPermissions(response.data.data);
        setPermissions(response.data);
      })

      .catch((error) => {
        handleError(error);
      });
    console.clear();
  }, []);

  const handleSubmit = async (values) => {
    const body = {
      name: values.name,
      permissions: values.permissions,
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/addon/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.ok) {
      SuccessAlert(data.message);
      navigate("/manageaddon");
    } else {
      ErrorAlert(data.message);
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

  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Addon is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Addon Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Addon Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        )
        .min(3, "The addon name must be at least 3 characters."),

      permissions: Yup.array()
        .required("At least one role is required")
        .min(1, "At least one role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (values.permissions.length === 0) {
        setSubmitting(false);
      } else {
        handleSubmit(values);
        setSubmitting(false);
      }
    },
  });
  // Add these states
  const [selectAllPermissions, setSelectAllPermissions] = useState({});

  useEffect(() => {
    if (permissions.data && Object.keys(permissions.data).length > 0) {
      const initialSelectAllState = {};
      Object.keys(permissions.data).forEach((heading) => {
        initialSelectAllState[heading] = false;
      });
      setSelectAllPermissions(initialSelectAllState);
    }
  }, [permissions.data]);

  const handleSelectAllPermissions = (heading, event) => {
    const newSelectAllState = { ...selectAllPermissions };
    newSelectAllState[heading] = event.target.checked;

    // Select/deselect all permissions in the group
    const permissionsInGroup = permissions.data[heading]?.names.map(
      (nameItem) => nameItem.name
    );
    formik.setFieldValue(`permissions`, [
      ...formik.values.permissions.filter(
        (permission) => !permissionsInGroup.includes(permission)
      ),
      ...(event.target.checked ? permissionsInGroup : []),
    ]);

    setSelectAllPermissions(newSelectAllState);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Add Addon</h1>
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
                linkProps={{ to: "/manageaddon" }}
              >
                Manage Addons
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add Addon
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row>
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <Card>
              <Card.Header>
                <h4 className="card-title">
                  Add Addon{" "}
                  <span className="text-danger danger-title">
                    * Atleast One Permission is Required{" "}
                  </span>
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <div className="col-lg- col-md-12">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="name">
                          {" "}
                          Add Addon
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          id="name"
                          name="name"
                          placeholder="Addon Name"
                          className={`input101 ${
                            formik.touched.name && formik.errors.name
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("name")}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        {permissions.data &&
                        Object.keys(permissions.data).length > 0 ? (
                          <div>
                            {Object.keys(permissions.data).map((heading) => (
                              <div key={heading}>
                                <div className="table-heading d-flex">
                                  <div className="heading-input ">
                                    <input
                                      className={`form-check-input ${
                                        formik.touched.permissions &&
                                        formik.errors.permissions
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      type="checkbox"
                                      checked={
                                        selectAllPermissions[heading] || false
                                      }
                                      onChange={(event) =>
                                        handleSelectAllPermissions(
                                          heading,
                                          event
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <h2>{heading}</h2>
                                  </div>
                                </div>
                                <div className="form-group">
                                  {permissions.data[heading].names.map(
                                    (nameItem) => (
                                      <div
                                        key={nameItem.id}
                                        className="form-check form-check-inline"
                                      >
                                        <input
                                          className={`form-check-input ${
                                            formik.touched.permissions &&
                                            formik.errors.permissions
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          type="checkbox"
                                          name="permissions"
                                          value={nameItem.name}
                                          id={`permission-${nameItem.id}`}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.permissions.includes(
                                            nameItem.name
                                          )}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`permission-${nameItem.id}`}
                                        >
                                          {nameItem.display_name}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>No permissions available.</div>
                        )}

                        {formik.touched.permissions &&
                          formik.errors.permissions && (
                            <div className="invalid-feedback">
                              {formik.errors.permissions}
                            </div>
                          )}
                      </div>

                      <div className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/manageaddon/`}
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                          // disabled={Object.keys(formik.errors).length > 0}
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </>
    </>
  );
};

export default withApi(AddAddon);
