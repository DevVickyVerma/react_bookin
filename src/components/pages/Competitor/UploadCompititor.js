import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";

const UploadCompetitor = (props) => {
  const { getData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [CompetitorData, setCompetitorData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const [isdataLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      client_id: "",

      image: null,
    },
    validationSchema: Yup.object({
      image: Yup.mixed()
        .required("File is required")
        .test("fileType", "Only XLSX and XLS files are allowed", (value) => {
          if (value) {
            const allowedFileTypes = [
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
              "application/vnd.ms-excel", // XLS
            ];
            const isValidFileType = allowedFileTypes.includes(value.type);
            return isValidFileType;
          }
          return false;
        }),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

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
    } catch (error) {
      console.error("API error:", error);
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

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          console.log(response, "company");
          setCompanyList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };

  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("client_id", selectedClientId);
    formData.append("file", values.image);

    // Set isLoading to true to display the loading indicator
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-compititor-price`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        SuccessToast(data.message);
        navigate("/competitor");
      } else {
        const errorData = await response.json();
        ErrorToast(errorData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      // Set isLoading back to false after the request is completed
      setIsLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
    formik.setFieldError("image", ""); // Clear any previous validation error
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };
  return (
    <>
      {isdataLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Upload Competitor Price</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/competitor" }}
              >
                Competitor
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Upload Competitor Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Upload Competitor Price</Card.Title>
              </Card.Header>
              {/* here my body will start */}
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={4} md={6}>
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
                              console.log(selectedType, "selectedType");

                              if (selectedType) {
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);
                                setSelectedClientId(selectedType);
                                setSiteList([]);
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
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
                    <Col lg={4} md={4}>
                      <div className="form-group">
                        <label htmlFor="image" className="form-label mt-4">
                          File
                          <span className="text-danger">*</span>
                        </label>
                        <div
                          className={`dropzone ${formik.errors.image && formik.touched.image
                            ? "is-invalid"
                            : ""
                            }`}
                          onDrop={(event) => handleDrop(event)}
                          onDragOver={(event) => event.preventDefault()}
                        >
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept=".xlsx, .xls"
                            onChange={(event) => handleImageChange(event)}
                            className="form-control"
                          />

                          <p>
                            Drag and drop your File here, or click to browse
                          </p>
                        </div>
                        {formik.errors.image && formik.touched.image && (
                          <div className="invalid-feedback">
                            {formik.errors.image}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/competitor/`}
                    >
                      Cancel
                    </Link>

                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(UploadCompetitor);
