import React, { useDebugValue, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../Utils/ToastUtils";

const MyModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [Listcompany, setCompanylist] = useState([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      clientlist: "",
      companylist: "",
    },
    validationSchema: Yup.object({
      clientlist: Yup.string().required("Client is required"),
      companylist: Yup.string().required("Company is required"),
    }),
    onSubmit: (values) => {
      handlesubmit(values);
      setShowModal(false);
    },
  });

  const handlesubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const SiteId = localStorage.getItem("AssignSiteId");

      const formData = new FormData();
      formData.append("id", SiteId);
      formData.append("client_id", values.clientlist);
      formData.append("company_id", values.companylist);

      setLoading(true); // Set isLoading to true

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/site/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        SuccessAlert(data.message);
        formik.resetForm();
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        ErrorAlert(errorMessage);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Set isLoading back to false
    }
  };

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

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchClientList = async () => {
    try {
      setLoading(true); // Set loading state to true

      const response = await axiosInstance.get("/clients");

      if (response.data.data.clients.length > 0) {
        setDropdownValue(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const fetchCompanyList = async (id) => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      setLoading(true); // Set isLoading to true
      const response = await axiosInstance.get(`/companies?client_id=${id}`);
      setCompanylist(response.data.data);
      if (response.data.length > 0) {
        // setCompanylist(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const clientList = () => {
    fetchClientList();
    setShowModal(true);
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <Button
            className="btn btn-primary btn-sm rounded-11 me-2"
            onClick={clientList}
          >
            <i>
              <svg
                className="table-Details"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                height="20"
                width="16"
              >
                <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
              </svg>
            </i>
          </Button>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header>
              <Modal.Title>Assign Site</Modal.Title>
              <button className="close" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="clientlist" className="form-label mt-4">
                    Select Client
                  </label>
                  <select
                    className={`input101 ${formik.errors.clientlist && formik.touched.clientlist
                      ? "is-invalid"
                      : ""
                      }`}
                    id="clientlist"
                    name="clientlist"
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      if (selectedType.length > 0 && selectedType) {
                        fetchCompanyList(selectedType);
                        formik.setFieldValue("clientlist", selectedType);
                      } else {
                        console.log(e.target.value, "dd");
                      }
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.clientlist}
                  >
                    <option value=""> Select Client</option>
                    {dropdownValue.clients &&
                      dropdownValue.clients.length > 0 ? (
                      dropdownValue.clients.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.client_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No clients</option>
                    )}
                  </select>
                  {formik.errors.clientlist && formik.touched.clientlist && (
                    <div className="invalid-feedback">
                      {formik.errors.clientlist}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="companylist" className="form-label mt-4">
                    Select Company
                  </label>
                  <select
                    className={`input101 ${formik.errors.companylist && formik.touched.companylist
                      ? "is-invalid"
                      : ""
                      }`}
                    id="companylist"
                    name="companylist"
                    onBlur={formik.handleBlur}
                    value={formik.values.companylist}
                    onChange={formik.handleChange}
                  >
                    <option value=""> Select Company</option>
                    {Listcompany.companies &&
                      Listcompany.companies.length > 0 ? (
                      Listcompany.companies.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.company_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No clients</option>
                    )}
                  </select>
                  {formik.errors.companylist && formik.touched.companylist && (
                    <div className="invalid-feedback">
                      {formik.errors.companylist}
                    </div>
                  )}
                </div>

                <Modal.Footer>
                  <Button variant="danger" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Assign
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default MyModal;
