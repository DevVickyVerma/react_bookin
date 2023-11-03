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

import axios from "axios";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const ErrorAlert = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true,
    transition: Slide,
    autoClose: 1000,
    theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
  });
};
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

const initialValues = {
  name: "",
  permissions: [],
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Role is required")
    .matches(/^[a-zA-Z0-9_\- ]+$/, {
      message: "Role Name must not contain special characters",
      excludeEmptyString: true,
    })
    .matches(
      /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
      {
        message: "Role Name must not have consecutive spaces",
        excludeEmptyString: true,
      }
    )
    .min(3, "The Role name must be at least 3 characters."),
  permissions: Yup.array()
    .required("At least one role is required")
    .min(1, "At least one role is required"),
});

const AddRoles = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [permissions, setPermissions] = useState([]);

  const [userpermissions, setUserPermissions] = useState([]);
  // const SuccessAlert = (message) => toast.success(message);
  // const ErrorAlert = (message) => toast.error(message);
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
    FetchTableData();
    console.clear();
  }, []);
  const FetchTableData = async () => {
    try {
      const response = await getData("/permission-list");

      if (response && response.data && response.data) {
        setUserPermissions(response.data.data);
        setPermissions(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        name: values.name,
        permissions: values.permissions,
      };

      const postDataUrl = "/role/create";
      const navigatePath = "/roles";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
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

  const [selectedMembers, setSelectedMembers] = useState([]);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        if (values.permissions.length === 0) {
          setSubmitting(false);
        } else {
          handleSubmit(values);
          setSubmitting(false);
        }
      }, 400);
    },
  });

  const handleSelectAllChange = (event, heading) => {
    const allMembers = permissions.data[heading].names.map(
      (nameItem) => nameItem.name
    );

    if (formik.values.permissions.includes(heading)) {
      // Remove heading and all members under it if already present
      formik.setFieldValue(
        "permissions",
        formik.values.permissions.filter(
          (permission) =>
            !allMembers.includes(permission) && permission !== heading
        )
      );
    } else {
      // Add heading and all members under it if not already present
      formik.setFieldValue("permissions", [
        ...formik.values.permissions,
        heading,
        ...allMembers.filter(
          (member) => !formik.values.permissions.includes(member)
        ),
      ]);
    }

    // If all members under the heading are not checked, remove the heading from permissions
    const membersChecked = allMembers.every((member) =>
      formik.values.permissions.includes(member)
    );
    if (!membersChecked && formik.values.permissions.includes(heading)) {
      formik.setFieldValue(
        "permissions",
        formik.values.permissions.filter((permission) => permission !== heading)
      );
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Add Role</h1>
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
                linkProps={{ to: "/roles" }}
              >
                Manage Roles
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add Role
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row>
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <Card>
              <Card.Header>
                <h4 className="card-title">
                  Add Role{" "}
                  <span className="text-danger danger-title">
                    * Atleast One Permission is Required
                  </span>
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <div className="col-lg- col-md-12">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="name">
                          {" "}
                          Add Role
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          id="name"
                          name="name"
                          placeholder="Role Name"
                          className={`input101 ${formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                            }`}
                          value={formik.values.name}
                          onChange={formik.handleChange}
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
                                      className={`form-check-input ${formik.touched.permissions &&
                                        formik.errors.permissions
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      type="checkbox"
                                      name={`selectAll_${heading}`}
                                      id={`select-all-${heading}`}
                                      checked={formik.values.permissions.includes(
                                        heading
                                      )}
                                      onChange={(event) =>
                                        handleSelectAllChange(event, heading)
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
                                          className={`form-check-input ${formik.touched.permissions &&
                                            formik.errors.permissions
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                          type="checkbox"
                                          name="permissions"
                                          value={nameItem.name}
                                          id={`permission-${nameItem.id}`}
                                          checked={formik.values.permissions.includes(
                                            nameItem.name
                                          )}
                                          onChange={() => {
                                            if (
                                              formik.values.permissions.includes(
                                                nameItem.name
                                              )
                                            ) {
                                              formik.setFieldValue(
                                                "permissions",
                                                formik.values.permissions.filter(
                                                  (permission) =>
                                                    permission !== nameItem.name
                                                )
                                              );
                                            } else {
                                              formik.setFieldValue(
                                                "permissions",
                                                [
                                                  ...formik.values.permissions,
                                                  nameItem.name,
                                                ]
                                              );
                                            }
                                          }}
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
                          <div>No permissions found.</div>
                        )}

                        {formik.touched.permissions &&
                          formik.errors.permissions && (
                            <div className="invalid-feedback">
                              {formik.errors.permissions}
                            </div>
                          )}
                      </div>

                      <div className="text-end">
                        <Link className="btn btn-danger me-2 " to={`/roles/`}>
                          Cancel
                        </Link>

                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                          disabled={Object.keys(formik.errors).length > 0}
                        >
                          Save
                        </button>
                      </div>
                    </form>
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

export default withApi(AddRoles);
