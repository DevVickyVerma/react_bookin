import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { toast } from "react-toastify";

export default function EditRoles() {
  const [permissions, setPermissions] = useState([]);
  const [addonitem, setAddonitem] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const [permissionArray, setPermissionArray] = useState([]);
  const [addonArray, setAddonArray] = useState([]);

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
    const addonId = localStorage.getItem("EditRoleID");
    const formData = new FormData();
    formData.append("role_id", addonId);

    axiosInstance
      .post("/role/detail", formData)
      .then((response) => {
        if (response) {
          const { data } = response;

          setAddonitem(response.data.data.addons);

          for (const key of Object.keys(data.data.permissions)) {
            let array = [];
            for (const item of data?.data?.permissions[key].names) {
              if (item.checked) {
                array.push(item.name);
              }
            }
            setPermissionArray((prevState) => [
              ...new Set([...prevState, ...array]),
            ]);
          }

          // Set initial values for form fields
          formik.setValues({
            name: data.data.role.name,
            permissions: permissionArray,
            addons: addonArray,
          });
        }

        setPermissions(response.data.data.permissions);
      })
      .catch((error) => {
        handleError(error);
      });
    console.clear();
    console.clear();
  }, []);

  const handleSubmit1 = async (values) => {
    const body = {
      name: values.name,
      permissions: values.permissions,
      addons: values.addons,
      role_id: localStorage.getItem("EditRoleID"),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/role/update`,
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
        navigate("/roles");
      } else {
        ErrorAlert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      ErrorAlert("An error occurred while updating the role.");
    }
  };

  const initialValues = {
    name: localStorage.getItem("EditRole_name") || "",
    permissions: [],
    addons: [],
  };

  const validationSchema = Yup.object().shape({
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
      ),
    permissions: Yup.array()
      .required("At least one role is required")
      .min(1, "At least one role is required"),
    addons: Yup.array()
      .required("At least one role is required")
      .min(1, "At least one role is required"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit1,
  });

  const { errors, touched, setFieldValue } = formik;

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Role</h1>
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
              Edit Role
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Edit Role</h4>
            </Card.Header>
            <div class="card-body">
              <Row>
                <div className="col-lg- col-md-12">
                  <form onSubmit={formik.handleSubmit1}>
                    <div className="form-group">
                      <label htmlFor="name">Edit Role</label>
                      <input
                        type="text"
                        autoComplete="off"
                        id="name"
                        name="name"
                        placeholder="Role Name"
                        className={`input101 ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <div className="table-heading">
                        <h2>Addons List</h2>
                      </div>
                      {addonitem && addonitem.length > 0 ? (
                        <div>
                          {addonitem.map((role) => (
                            <div
                              key={role.id}
                              className="form-check form-check-inline"
                            >
                              <input
                                className={`form-check-input ${
                                  touched.addons && errors.addons
                                    ? "is-invalid"
                                    : ""
                                }`}
                                type="checkbox"
                                name="addons"
                                value={role.id}
                                id={`addons-${role.id}`}
                                checked={formik.values.addons.includes(role.id)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const addonId = e.target.value;

                                  if (isChecked) {
                                    formik.setFieldValue("addons", [
                                      ...formik.values.addons,
                                      addonId,
                                    ]);
                                  } else {
                                    formik.setFieldValue(
                                      "addons",
                                      formik.values.addons.filter(
                                        (id) => id !== addonId
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`addons-${role.id}`}
                              >
                                {role.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          No Records Found Please
                          <Link className="m-2" to={`/addaddon/`}>
                            Add Addon
                          </Link>
                        </div>
                      )}

                      {touched.addons && errors.addons && (
                        <div className="invalid-feedback">{errors.addons}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <div>
                        <div className="table-heading">
                          <h2>Permissions</h2>
                        </div>
                        {Object.keys(permissions).length > 0 ? (
                          Object.keys(permissions).map((heading) => (
                            <div key={heading}>
                              <div className="table-heading">
                                <h2>{heading}</h2>
                              </div>
                              <div className="form-group">
                                {permissions[heading].names.map((nameItem) => (
                                  <div
                                    key={nameItem.id}
                                    className="form-check form-check-inline"
                                  >
                                    <input
                                      className={`form-check-input ${
                                        touched.permissions &&
                                        errors.permissions
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
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        const permissionName = nameItem.name;

                                        if (isChecked) {
                                          formik.setFieldValue("permissions", [
                                            ...formik.values.permissions,
                                            permissionName,
                                          ]);
                                        } else {
                                          formik.setFieldValue(
                                            "permissions",
                                            formik.values.permissions.filter(
                                              (name) => name !== permissionName
                                            )
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
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>No Records Found Please</div>
                        )}
                      </div>

                      {touched.permissions && errors.permissions && (
                        <div className="invalid-feedback">
                          {errors.permissions}
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
                        // disabled={Object.keys(errors).length > 0}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Row>
            </div>
          </Card>
        </div>
      </Row>
    </>
  );
}
