import React, { useEffect } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const EditBussiness = (props) => {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();

  function handleError(error) {
    if (error.response && error.response.charge_status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (
      error.response &&
      error.response.data.charge_status_code === "403"
    ) {
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
      const response = await getData(`/charge/${id}`);

      if (response) {
        formik.setValues(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("charge_code", values.charge_code);
      formData.append("charge_name", values.charge_name);
      formData.append("charge_status", values.charge_status);
      formData.append("id", values.id);

      const postDataUrl = "/charge/update";
      const navigatePath = "/managecharges";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      charge_code: "",
      charge_name: "",

      charge_status: "1",
    },
    validationSchema: Yup.object({
      charge_code: Yup.string().required("Charge code is required"),

      charge_name: Yup.string()
        .required("Charge Name is required"),
      charge_status: Yup.string().required(" Status is required"),
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
              <h1 className="page-title">Edit Charges</h1>

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
                  linkProps={{ to: "/managecharges" }}
                >
                  Manage Charges
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Charges
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Charges</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="charge_name"
                          >
                            Charges Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.charge_name &&
                              formik.touched.charge_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="charge_name"
                            name="charge_name"
                            placeholder="Charge Code"
                            onChange={formik.handleChange}
                            value={formik.values.charge_name || ""}
                          />
                          {formik.errors.charge_name &&
                            formik.touched.charge_name && (
                              <div className="invalid-feedback">
                                {formik.errors.charge_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="charge_code"
                          >
                            Charges Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="charge_code"
                            charge_code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.charge_code &&
                              formik.touched.charge_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Charge Code"
                            onChange={formik.handleChange}
                            value={formik.values.charge_code || ""}
                            readOnly
                          />
                          {formik.errors.charge_code &&
                            formik.touched.charge_code && (
                              <div className="invalid-feedback">
                                {formik.errors.charge_code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="charge_status"
                          >
                            Charge Status <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.charge_status &&
                              formik.touched.charge_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="charge_status"
                            name="charge_status"
                            onChange={formik.handleChange}
                            value={formik.values.charge_status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.charge_status &&
                            formik.touched.charge_status && (
                              <div className="invalid-feedback">
                                {formik.errors.charge_status}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="sussbmit"
                        className="btn btn-danger me-2 "
                        to={`/managecharges/`}
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
export default withApi(EditBussiness);
