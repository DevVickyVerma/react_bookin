import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import {
  Card,
  Col,
  Form,
  FormGroup,
  Row,
  Modal, // Import Modal from react-bootstrap
} from "react-bootstrap";
import { ErrorAlert } from "../../Utils/ToastUtils";
import Loaderimg from "../../Utils/Loader";


const WorkflowExceptionFilter = (props) => {
  const {
    title,
    visible,
    onClose,
    onformSubmit,
  } = props;

  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const navigate = useNavigate();
  function handleError(error) {
    if (error.response && error.response.deduction_status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (
      error.response &&
      error.response.data.deduction_status_code === "403"
    ) {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  const handleCloseModal = () => {
    onClose(); // Call the onClose function passed as a prop
  };
  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      client_name: "",
      company_id: "",
      company_name: "",
      site_id: "",
      site_name: "",
      start_date: "",
    },
    onSubmit: (values) => {
      onformSubmit(values);
    },
  });

  const fetchCommonListData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/common/client-list");
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      const { data } = response;
      if (data) {
        setClientList(response.data);
        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);
          setSelectedCompanyList([]);

          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
              setSelectedCompanyList(selectedClient?.companies);
            }
          }
        }
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  const GetCompanyList = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`common/company-list?client_id=${values}`);
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      if (response) {
        setCompanyList(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  const GetSiteList = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`common/site-list?company_id=${values}`);
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      if (response) {
        setSiteList(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);
  return (
    <>

      {isLoading ? <Loaderimg /> : null}
      {/* Wrap your modal content with Modal component */}
      <Modal show={visible} onHide={onClose} centered>
        <Modal.Header
          style={{
            color: "#fff",
            background: "#6259ca",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Modal.Title style={{ marginBottom: "0px" }}>{title}</Modal.Title>
          </div>
          <div>
            <span
              className="modal-icon"
              onClick={handleCloseModal}
              style={{ cursor: "pointer" }}
            >
              <AiOutlineClose />
            </span>
          </div>
        </Modal.Header>

        <form onSubmit={formik.handleSubmit}>
          <Card.Body>

            <Row>
              {localStorage.getItem("superiorRole") !== "Client" && (
                <Col lg={6} md={6}>
                  <div className="form-group">
                    <label
                      htmlFor="client_id"
                      className="form-label mt-4"
                    >
                      Client
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`input101 ${formik.errors.client_id &&
                        formik.touched.client_id
                        ? "is-invalid"
                        : ""
                        }`}
                      id="client_id"
                      name="client_id"
                      value={formik.values.client_id}
                      onChange={(e) => {
                        const selectedType = e.target.value;

                        if (selectedType) {
                          GetCompanyList(selectedType);
                          formik.setFieldValue("client_id", selectedType);
                          setSelectedClientId(selectedType);
                          setSiteList([]);
                          formik.setFieldValue("company_id", "");
                          formik.setFieldValue("site_id", "");


                          const selectedClient =
                            ClientList?.data?.find(
                              (client) =>
                                client.id === selectedType
                            );
                          if (selectedClient) {
                            formik.setFieldValue("client_name", selectedClient?.client_name);
                          }
                        } else {
                          console.log(
                            selectedType,
                            "selectedType no values"
                          );
                          formik.setFieldValue("client_id", "");
                          formik.setFieldValue("company_id", "");
                          formik.setFieldValue("site_id", "");

                          setSiteList([]);
                          setCompanyList([]);
                        }
                      }}
                    >
                      <option value="">Select a Client</option>
                      {ClientList.data && ClientList.data.length > 0 ? (
                        ClientList.data.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.client_name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Client</option>
                      )}
                    </select>

                    {formik.errors.client_id &&
                      formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                  </div>
                </Col>
              )}

              <Col Col lg={6} md={6}>
                <div className="form-group">
                  <label htmlFor="company_id" className="form-label mt-4">
                    Company
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`input101 ${formik.errors.company_id &&
                      formik.touched.company_id
                      ? "is-invalid"
                      : ""
                      }`}
                    id="company_id"
                    name="company_id"
                    value={formik.values.company_id}
                    onChange={(e) => {
                      const selectcompany = e.target.value;

                      if (selectcompany) {
                        GetSiteList(selectcompany);
                        formik.setFieldValue("company_id", selectcompany);
                        formik.setFieldValue("site_id", "");
                        setSelectedCompanyId(selectcompany);

                        const selectedCompanyData =
                          CompanyList?.find(
                            (company) =>
                              company?.id ===
                              selectcompany
                          );
                        if (selectedCompanyData) {
                          formik.setFieldValue("company_name", selectedCompanyData?.company_name);
                          formik.setFieldValue("company_id", selectedCompanyData?.id);
                          // setSelectedCompanyFullData(selectedCompanyData)
                        }

                      } else {
                        formik.setFieldValue("company_id", "");
                        formik.setFieldValue("site_id", "");

                        setSiteList([]);
                      }
                    }}
                  >
                    <option value="">Select a Company</option>
                    {selectedClientId && CompanyList.length > 0 ? (
                      <>
                        setSelectedCompanyId([])
                        {CompanyList.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.company_name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option disabled>No Company</option>
                    )}
                  </select>
                  {formik.errors.company_id &&
                    formik.touched.company_id && (
                      <div className="invalid-feedback">
                        {formik.errors.company_id}
                      </div>
                    )}
                </div>
              </Col>

              <Col lg={6} md={6}>
                <div className="form-group">
                  <label htmlFor="site_id" className="form-label mt-4">
                    Site Name
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`input101 ${formik.errors.site_id && formik.touched.site_id
                      ? "is-invalid"
                      : ""
                      }`}
                    id="site_id"
                    name="site_id"
                    value={formik.values.site_id}
                    onChange={(e) => {
                      const selectedsite_id = e.target.value;

                      formik.setFieldValue("site_id", selectedsite_id);
                      setSelectedSiteId(selectedsite_id);

                      const selectedSiteData =
                        SiteList.find(
                          (site) =>
                            site.id === selectedsite_id
                        );
                      if (selectedSiteData) {
                        formik.setFieldValue(
                          "site_name",
                          selectedSiteData.site_name
                        ); // Set site_name using setFieldValue
                      }

                    }}
                  >
                    <option value="">Select a Site</option>
                    {CompanyList && SiteList.length > 0 ? (
                      SiteList.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.site_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Site</option>
                    )}
                  </select>
                  {formik.errors.site_id && formik.touched.site_id && (
                    <div className="invalid-feedback">
                      {formik.errors.site_id}
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={6} md={6}>
                <div className="form-group">
                  <label htmlFor="start_date" className="form-label mt-4">
                    Start Date
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    className={`input101 ${formik.errors.start_date && formik.touched.start_date
                      ? "is-invalid"
                      : ""
                      }`}
                    type="date"
                    min="2023-01-01"
                    onChange={(e) => {
                      const selectedstart_date = e.target.value;
                      formik.setFieldValue("start_date", selectedstart_date);
                      // You can keep the logic for setting the field value here if needed
                    }}
                    id="start_date"
                    name="start_date"
                    onClick={handleShowDate}
                    value={formik.values.start_date}
                  />
                  {formik.errors.start_date && formik.touched.start_date && (
                    <div className="invalid-feedback">
                      {formik.errors.start_date}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

          </Card.Body>
          <hr />
          <Card.Footer className="text-end" style={{ border: "none" }}>
            <button className="btn btn-primary me-2" type="submit">
              Submit
            </button>
          </Card.Footer>


        </form>
      </Modal>
    </>
  );
};

WorkflowExceptionFilter.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default WorkflowExceptionFilter;
