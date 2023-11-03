import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddSitePump = (props) => {
  const { id } = useParams();
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedFuelList, setSelectedFuelList] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);


  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const handleFuelChange = async (id) => {
    try {
      const response = await axiosInstance.get(`/site/fuel/list?site_id=${id}`);

      if (response.data) {
        setSelectedFuelList(response.data);
      }
    } catch (error) {
      // handleError(error);
    }
  };

  const handleSubmit1 = async (values) => {
    try {
      const tank = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };

      localStorage.setItem("SiteTAnk", JSON.stringify(tank));
      const formData = new FormData();
      formData.append("tank_name", values.tank_name);
      formData.append("tank_code", values.tank_code);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("fuel_id", values.fuel_id);

      const postDataUrl = "/site-tank/add";

      const navigatePath = "/managesitetank";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
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
      tank_name: "",
      tank_code: "",
      status: "1",
      site_id: "",
      fuel_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
      fuel_id: Yup.string().required("Fuel Name is required"),

      tank_name: Yup.string().required(
        " Site Tank Name is required"
      ),

      tank_code: Yup.string()
        .required("Site Tank Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message:
            "Tank Code must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message:
              "Site Tank Code must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required(
        "Site Tank Status is required"
      ),
    }),

    onSubmit: (values) => {
      handleSubmit1(values);
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

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {
          console.log(response, "company");
          setSiteList(response?.data?.data);
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
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site Tank</h1>

              <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{ to: "/dashboard" }}
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Manage Site Tank
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site Tank</Card.Title>
                </Card.Header>


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

                      <Col Col lg={4} md={6}>
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
                                setSelectedCompanyId(selectcompany);
                                formik.setFieldValue("site_id", "");
                                formik.setFieldValue("company_id", selectcompany);
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

                      <Col lg={4} md={6}>
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
                              handleFuelChange(selectedsite_id)
                              formik.setFieldValue("site_id", selectedsite_id);
                              setSelectedSiteId(selectedsite_id);
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


                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="fuel_id"
                            className="form-label mt-4"
                          >
                            Fuel Name
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${formik.errors.fuel_id && formik.touched.fuel_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="fuel_id"
                            name="fuel_id"
                            onChange={formik.handleChange}
                            value={formik.values.fuel_id}
                          >
                            <option value="">Select Fuel Name</option>

                            {selectedFuelList ? (
                              selectedFuelList?.data?.fuels.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.fuel_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Client</option>
                            )}
                          </select>
                          {formik.errors.fuel_id && formik.touched.fuel_id && (
                            <div className="invalid-feedback">
                              {formik.errors.fuel_id}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="status"
                          >
                            Site Tank Status
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
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
                          <label
                            className=" form-label mt-4"
                            htmlFor="tank_name"
                          >
                            Site Tank Name
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            autoComplete="off"
                            // className="form-control"
                            className={`input101 ${formik.errors.tank_name && formik.touched.tank_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="tank_name"
                            name="tank_name"
                            placeholder="Site Tank Name"
                            onChange={formik.handleChange}
                            value={formik.values.tank_name}
                          />
                          {formik.errors.tank_name && formik.touched.tank_name && (
                            <div className="invalid-feedback">
                              {formik.errors.tank_name}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="tank_code"
                          >
                            Site Tank Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.tank_code && formik.touched.tank_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="tank_code"
                            name="tank_code"
                            placeholder="Site Tank Code"
                            onChange={formik.handleChange}
                            value={formik.values.tank_code}
                          />
                          {formik.errors.tank_code && formik.touched.tank_code && (
                            <div className="invalid-feedback">
                              {formik.errors.tank_code}
                            </div>
                          )}
                        </div>
                      </Col>

                    </Row>
                    <Card.Footer className="text-end">
                      <button className="btn btn-primary me-2" type="submit">
                        Add
                      </button>
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to="/managesitepump"
                      >
                        Cancel
                      </Link>
                    </Card.Footer>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddSitePump);
