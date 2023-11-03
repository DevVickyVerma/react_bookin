import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";

import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@material-ui/core";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const EditUsers = (props) => {
  const { isLoading, getData, postData } = props;

  const navigate = useNavigate();
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [SelectedClient, setSelectedClient] = useState();
  const [roleItems, setRoleItems] = useState("");
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
  const handleFetchData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setAddSiteData(response?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchClientList();
    handleFetchData();
    FetchRoleList();
    console.clear();
  }, []);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const { id } = useParams();
  let combinedClientNames = [];
  let combinedClientId = [];
  const fetchClientList = async () => {
    try {
      const response = await axiosInstance.get(`/user/detail?id=${id}`);

      if (response) {
        formik.setValues(response.data.data);
        response?.data?.data?.clients.forEach((client) => {
          combinedClientNames.push(client.client_name);
          combinedClientId.push(client.id);
        });

        setSelectedItems(combinedClientNames);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("first_name", values.first_name);

      formData.append("last_name", values.last_name);

      formData.append("id", id);

      formData.append("role_id", values.role_id);

      localStorage.getItem("superiorRole") === "Client" &&
        formData.append("work_flow", values.work_flow);

      formData.append("status", values.status);
      if (SelectedClient !== null && SelectedClient !== undefined) {
        SelectedClient.forEach((client, index) => {
          formData.append(`assign_client[${index}]`, client);
        });
      }

      const postDataUrl = "/user/update";
      const navigatePath = "/users";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      id: "",
      role_id: "",
      last_name: "",
      work_flow: "",

      status: "1",
    },
    validationSchema: Yup.object({
      role_id: Yup.string().required("Role is required"),
      first_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("First Name is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last Name is required"),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const FetchRoleList = async () => {
    try {
      const response = await getData("/role/list");

      if (response && response.data && response.data.data.roles) {
        setRoleItems(response.data.data.roles);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit User</h1>

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
                  linkProps={{ to: "/users" }}
                >
                  Manage User
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit User
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit User</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="first_name"
                          >
                            First Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.first_name &&
                              formik.touched.first_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="first_name"
                            name="first_name"
                            placeholder="First Name Name"
                            onChange={formik.handleChange}
                            value={formik.values.first_name}
                          />
                          {formik.errors.first_name &&
                            formik.touched.first_name && (
                              <div className="invalid-feedback">
                                {formik.errors.first_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <label htmlFor="last_name" className="form-label mt-4">
                          Last Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.last_name && formik.touched.last_name
                            ? "is-invalid"
                            : ""
                            }`}
                          id="last_name"
                          name="last_name"
                          placeholder="  Last Name"
                          onChange={formik.handleChange}
                          value={formik.values.last_name || ""}
                        />
                        {formik.errors.last_name &&
                          formik.touched.last_name && (
                            <div className="invalid-feedback">
                              {formik.errors.last_name}
                            </div>
                          )}
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
                            Status<span className="text-danger">*</span>
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

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="role_id" className="form-label mt-4">
                            Role
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.role_id && formik.touched.role_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="role_id"
                            name="role_id"
                            onChange={formik.handleChange}
                            value={formik.values.role_id}
                          >
                            <option value="">Select a Role</option>
                            {roleItems ? (
                              roleItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Role</option>
                            )}
                          </select>
                          {formik.errors.role_id && formik.touched.role_id && (
                            <div className="invalid-feedback">
                              {formik.errors.role_id}
                            </div>
                          )}
                        </div>
                      </Col>
                      {localStorage.getItem("superiorRole") !== "Client" ? (
                        <Col lg={4} md={6}>
                          <FormControl className="width">
                            <InputLabel>Select Clients</InputLabel>
                            <Select
                              multiple
                              value={selectedItems}
                              // value={selectedItemsId}
                              onChange={(event) => {
                                setSelectedItems(event.target.value);

                                const selectedSiteNames = event.target.value;
                                const filteredSites = AddSiteData?.data?.filter(
                                  (item) =>
                                    // selectedSiteNames.includes(item.client_name)
                                    selectedSiteNames.includes(item.full_name)
                                );

                                const ids = filteredSites.map(
                                  (data) => data.id
                                );
                                setSelectedClient(ids);
                              }}
                              renderValue={(selected) => selected.join(", ")}
                            >
                              <MenuItem disabled value="">
                                <em>Select items</em>
                              </MenuItem>

                              {AddSiteData?.data?.map((item) => {
                                const isItemSelected = selectedItems.includes(
                                  item.full_name
                                );

                                return (
                                  <MenuItem
                                    // key={item.client_name}
                                    // value={item.client_name}
                                    key={item.full_name}
                                    value={item.full_name}
                                  >
                                    <Checkbox checked={isItemSelected} />
                                    <ListItemText primary={item.full_name} />
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Col>
                      ) : (
                        ""
                      )}
                      {localStorage.getItem("role") === "Client" ? (
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="work_flow"
                              className="form-label mt-4"
                            >
                              Workflow Notification
                            </label>
                            <select
                              className={`input101 ${formik.errors.work_flow &&
                                formik.touched.work_flow
                                ? "is-invalid"
                                : ""
                                }`}
                              id="work_flow"
                              name="work_flow"
                              onChange={formik.handleChange}
                              value={formik.values.work_flow}
                            >
                              <option value="1">Enable</option>
                              <option value="0">Disable</option>
                            </select>
                            {formik.errors.work_flow &&
                              formik.touched.work_flow && (
                                <div className="invalid-feedback">
                                  {formik.errors.work_flow}
                                </div>
                              )}
                          </div>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>

                    <div className="text-end my-5 text-end-small-screen">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/users/`}
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

export default withApi(EditUsers);
