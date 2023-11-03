import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
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
import { useFormik } from "formik"; // Importing useFormik hook
import * as Yup from "yup";

import axios from "axios";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const EditRoles = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissions, setPermissions] = useState([]);
  const [addonitem, setAddonitem] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);
  const { id } = useParams();
  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored",
    });
  };
  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored",
    });
  };

  const [permissionArray, setPermissionArray] = useState([]);
  const [addonArray, setAddonArray] = useState([]);
  const successToasts = {};

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
    FetchPermisionList();
    console.clear();
    console.clear();
  }, []);
  const FetchPermisionList = async () => {
    try {
      const formData = new FormData();
      formData.append("role_id", id);
      const response = await getData("/role/detail", id, formData);

      if (response && response.data) {
        const { data } = response.data;
        console.log(data, "response");
        formik.setFieldValue("permissionsname", data?.name);

        // Initialize an empty array to hold the filtered permission names
        const filteredPermissions = [];

        for (const key of Object.keys(data.permissions)) {
          let array = [];
          for (const item of data.permissions[key].names) {
            if (item.checked) {
              array.push(item.name);
            }
          }
          filteredPermissions.push(...array);
        }

        // Use Set to remove duplicates from the filteredPermissions array
        setPermissionArray([...new Set(filteredPermissions)]);
        setPermissions(data.permissions);
        const filteredNames = [];

        // Loop through each category in data.permissions
        for (const category in data.permissions) {
          const categoryData = data.permissions[category];

          // Filter the names with "checked": true and add them to the filteredNames array
          const names = categoryData.names
            .filter((item) => item.checked === true)
            .map((item) => item.name);

          filteredNames.push(...names);
        }

        formik.setFieldValue("permissions", filteredNames);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // Define the initial form values and validation schema using Yup
  const formik = useFormik({
    initialValues: {
      name: localStorage.getItem("EditRole_name") || "",
      permissions: [],
    },
    validationSchema: Yup.object().shape({
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
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  // const handleSubmit = async (values) => {
  //   try {
  //     const body = {
  //       name: values.name,
  //       permissions: values.permissions,
  //       role_id: localStorage.getItem("EditRoleID"),
  //     };

  //     const token = localStorage.getItem("token");

  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_URL}/role/update`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       SuccessAlert(data.message);
  //       navigate("/roles");
  //     } else {
  //       ErrorAlert(error.message);
  //       const errorData = await response.json();
  //       throw new Error(errorData.message);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("role_id", id);

      // Loop through the array and append each value individually
      values.permissions.forEach((permission, index) => {
        formData.append(`permissions[${index}]`, permission);
      });

      const postDataUrl = "/role/update";
      const navigatePath = `/roles`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {}
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleHeadingCheckboxChange = (heading, isChecked) => {
    const headingPermissions = permissions[heading]?.names;

    if (headingPermissions) {
      // Get the names of the children items for the selected heading
      const childrenNames = headingPermissions.map((item) => item.name);

      // Create a Set from the current state of permissionArray
      const uniquePermissionSet = new Set(permissionArray);

      // Add or remove children names based on the heading checkbox state
      if (isChecked) {
        childrenNames.forEach((name) => uniquePermissionSet.add(name));
      } else {
        childrenNames.forEach((name) => uniquePermissionSet.delete(name));
      }

      // Convert the Set back to an array
      const updatedPermissionArray = Array.from(uniquePermissionSet);

      // Update the state and form field with the new permissionArray
      setPermissionArray(updatedPermissionArray);

      formik.setFieldValue("permissions", updatedPermissionArray);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
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
                <h4 className="card-title">
                  Edit Role{" "}
                  <span className="text-danger danger-title">
                    * Atleast One Permission is Required{" "}
                  </span>
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <div className="col-lg- col-md-12">
                    <div>
                      <label className=" form-label mt-4" htmlFor="name">
                        Edit Role
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        id="name"
                        name="name"
                        placeholder="RoleName"
                        className={`input101 ${
                          formik.touched.name && formik.errors.name
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

                    <div>
                      {Object.keys(permissions).length > 0 ? (
                        Object.keys(permissions).map((heading) => (
                          <div key={heading}>
                            <div className="table-heading d-flex">
                              <div className="heading-input ">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`heading_${heading}`}
                                  id={`heading_${heading}`}
                                  checked={
                                    permissions[heading]?.names.every((item) =>
                                      permissionArray.includes(item.name)
                                    ) || false
                                  }
                                  onChange={(e) =>
                                    handleHeadingCheckboxChange(
                                      heading,
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <h2>{heading}</h2>
                              </div>
                            </div>
                            <div className="form-group">
                              {permissions[heading].names.map((nameItem) => (
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
                                    checked={permissionArray.includes(
                                      nameItem.name
                                    )} // Check if the name is in permissionArray
                                    onChange={(e) => {
                                      // Get the name of the permission being changed from the current element
                                      const permissionName = nameItem.name;

                                      // Create a new array from the current state of permissionArray
                                      const updatedPermissionArray = [
                                        ...permissionArray,
                                      ];

                                      // Find the index of the permissionName in the updatedPermissionArray
                                      const findInd =
                                        updatedPermissionArray.findIndex(
                                          (item) => item === permissionName
                                        );

                                      // If the permissionName is already in the array, remove it
                                      if (findInd >= 0) {
                                        updatedPermissionArray.splice(
                                          findInd,
                                          1
                                        );
                                      }
                                      // Otherwise, add the permissionName to the array
                                      else {
                                        updatedPermissionArray.push(
                                          permissionName
                                        );
                                      }

                                      // Update the state of permissionArray with the updatedPermissionArray
                                      setPermissionArray(
                                        updatedPermissionArray
                                      );

                                      // Update the form field "permissionsList" with the updatedPermissionArray
                                      formik.setFieldValue(
                                        "permissions",
                                        updatedPermissionArray
                                      );
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

                    {formik.touched.permissions &&
                      formik.errors.permissions && (
                        <div className="invalid-feedback">
                          {formik.errors.permissions}
                        </div>
                      )}
                  </div>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="text-end">
                  <Link className="btn btn-danger me-2 " to={`/roles/`}>
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary me-2 "
                    disabled={Object.keys(formik.errors).length > 0}
                    onClick={formik.handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </Row>
      </>
    </>
  );
};

export default withApi(EditRoles);
