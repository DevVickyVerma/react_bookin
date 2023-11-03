import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const EditSiteTank = (props) => {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();
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
      const response = await getData(`/site-tank/${id}`);

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

      formData.append("tank_code", values.tank_code);
      formData.append("tank_name", values.tank_name);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("id", values.id);

      const postDataUrl = "/site-tank/update";
      const navigatePath = "/managesitetank";

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

  const formik = useFormik({
    initialValues: {
      tank_code: "",
      tank_name: "",
      status: "1",
    },
    validationSchema: Yup.object({
      tank_name: Yup.string().required("Site Tank Name is required"),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Site Tank</h1>

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
                  linkProps={{ to: "/managesitetanks" }}
                >
                  Manage Site Tank
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Site Tank
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Site Tank</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="tank_name"
                          >
                            Site Tank Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.tank_name &&
                              formik.touched.tank_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="tank_name"
                            name="tank_name"
                            placeholder="Site Tank Name"
                            onChange={formik.handleChange}
                            value={formik.values.tank_name || ""}
                          />
                          {formik.errors.tank_name &&
                            formik.touched.tank_name && (
                              <div className="invalid-feedback">
                                {formik.errors.tank_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="tank_code"
                          >
                            Site Tank Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="tank_code"
                            tank_code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.tank_code &&
                              formik.touched.tank_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Site Tank Code"
                            onChange={formik.handleChange}
                            value={formik.values.tank_code || ""}
                            readOnly
                          />
                          {formik.errors.tank_code &&
                            formik.touched.tank_code && (
                              <div className="invalid-feedback">
                                {formik.errors.tank_code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="status">
                            Site Tank Status{" "}
                            <span className="text-danger">*</span>
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
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managesitetank/`}
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
export default withApi(EditSiteTank);
