import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const SiteSettings = (props) => {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();
  const [ToleranceData, setToleranceData] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
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
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    console.clear();
  }, []);

  useEffect(() => {
    let clientIDCondition = "";
    if (localStorage.getItem("superiorRole") !== "Client") {
      clientIDCondition = `client_id=${formik.values.client_id}&`;
    } else {
      clientIDCondition = `client_id=${clientIDLocalStorage}`;
    }

    const fetchData = async () => {
      if (selectedSiteId) {
        try {
          const response = await getData(
            `/tolerance/?site_id=${formik.values.site_id}&${clientIDCondition}&company_id=${formik.values.company_id}`
          );
          const { data } = response;
          if (data) {
            formik.setValues(data.data);
            // Process the API response and update your state or perform other actions
          }
        } catch (error) {
          console.error("API error:", error);
          // Handle error if the API call fails
        }
      }
    };

    if (selectedSiteId !== undefined) {
      fetchData();
    }
  }, [selectedSiteId]);



  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append(
        "max_dip_gain_loss_variance",
        values.max_dip_gain_loss_variance
      );
      formData.append("max_banking_variance", values.max_banking_variance);
      formData.append(
        "max_fuel_inv_sale_variance",
        values.max_fuel_inv_sale_variance
      );
      formData.append("max_bunkering_variance", values.max_bunkering_variance);
      formData.append("low_tank_limit", values.low_tank_limit);
      // formData.append("vat_rate", values.vat_rate);
      formData.append("client_id", selectedClientId);
      formData.append("company_id", selectedCompanyId);
      formData.append("site_id", selectedSiteId);
      // formData.append("average_ppl", values.average_ppl);
      formData.append("max_dip_gain_loss_variance_lt", "0");

      const postDataUrl = "tolerance/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      max_dip_gain_loss_variance: "",
      max_banking_variance: "",
      max_fuel_inv_sale_variance: "",
      max_bunkering_variance: "",
      low_tank_limit: "",
      vat_rate: "",
      client_id: "",
      company_id: "",
      site_id: "",
      average_ppl: "",
    },
    validationSchema: Yup.object({
      max_dip_gain_loss_variance: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Max Dips Gians/Loss Variance is required"),
      max_banking_variance: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required(" Max Banking Variance is required"),
      max_bunkering_variance: Yup.string().required(
        "Bunkring Tolerance is required"
      ),
      low_tank_limit: Yup.string().required("Low Tank Limit is required"),

      max_fuel_inv_sale_variance: Yup.string().required("Max Fuel is required"),
      // vat_rate: Yup.string().required("Vat Rate is required"),
      // average_ppl: Yup.string().required("Use Avg Ppl is required"),
    }),
    onSubmit: handleSubmit,
  });

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "cards-status-update"
  );
  const isEditPermissionAvailable =
    permissionsArray?.includes("tolerance-update");

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
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Tolerances</h1>

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
                linkProps={{ to: "/sites" }}
              >
                Tolerances
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Tolerances</Card.Title>
              </Card.Header>

              <div class="card-body">
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
                              formik.setFieldValue("site_id", "");
                              formik.setFieldValue("company_id", selectcompany);
                              setSelectedCompanyId(selectcompany);
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
                          className="form-label mt-4"
                          htmlFor="max_banking_variance"
                        >
                          Max Banking Variance
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.max_banking_variance &&
                            formik.touched.max_banking_variance
                            ? "is-invalid"
                            : ""
                            }`}
                          id="max_banking_variance"
                          name="max_banking_variance"
                          placeholder=" Max Banking Variance"
                          onChange={formik.handleChange}
                          value={formik.values.max_banking_variance}
                        />
                        {formik.errors.max_banking_variance &&
                          formik.touched.max_banking_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_banking_variance}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          className="form-label mt-4"
                          htmlFor="max_dip_gain_loss_variance"
                        >
                          Max Dips Gians/Loss Variance
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          id="max_dip_gain_loss_variance"
                          name="max_dip_gain_loss_variance"
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.max_dip_gain_loss_variance &&
                            formik.touched.max_dip_gain_loss_variance
                            ? "is-invalid"
                            : ""
                            }`}
                          placeholder=" Max Dips Gians/Loss Variance"
                          onChange={formik.handleChange}
                          value={formik.values.max_dip_gain_loss_variance}
                        />
                        {formik.errors.max_dip_gain_loss_variance &&
                          formik.touched.max_dip_gain_loss_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_dip_gain_loss_variance}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={4} md={6}>
                      <label
                        htmlFor="max_fuel_inv_sale_variance"
                        className="form-label mt-4"
                      >
                        Max Fuel Inventory/Sales Variance
                      </label>
                      <input
                        type="number"
                        autoComplete="off"
                        className={`input101 ${formik.errors.max_fuel_inv_sale_variance &&
                          formik.touched.max_fuel_inv_sale_variance
                          ? "is-invalid"
                          : ""
                          }`}
                        id="max_fuel_inv_sale_variance"
                        name="max_fuel_inv_sale_variance"
                        placeholder="  Max Fuel Inventory/Sales Variance"
                        onChange={formik.handleChange}
                        value={formik.values.max_fuel_inv_sale_variance}
                      />
                      {formik.errors.max_fuel_inv_sale_variance &&
                        formik.touched.max_fuel_inv_sale_variance && (
                          <div className="invalid-feedback">
                            {formik.errors.max_fuel_inv_sale_variance}
                          </div>
                        )}
                    </Col>

                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="low_tank_limit"
                          className="form-label mt-4"
                        >
                          Low Tank Limit
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.low_tank_limit &&
                            formik.touched.low_tank_limit
                            ? "is-invalid"
                            : ""
                            }`}
                          id="low_tank_limit"
                          name="low_tank_limit"
                          placeholder="Low Tank Limit"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.low_tank_limit}
                        />
                        {formik.errors.low_tank_limit &&
                          formik.touched.low_tank_limit && (
                            <div className="invalid-feedback">
                              {formik.errors.low_tank_limit}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="max_bunkering_variance"
                          className="form-label mt-4"
                        >
                          Bunkering Tolerance
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.max_bunkering_variance &&
                              formik.touched.max_bunkering_variance
                              ? "is-invalid"
                              : ""
                              }`}
                            id="max_bunkering_variance"
                            name="max_bunkering_variance"
                            placeholder="Bunkering Tolerance"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.max_bunkering_variance}
                          />
                        </div>

                        {formik.errors.max_bunkering_variance &&
                          formik.touched.max_bunkering_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_bunkering_variance}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Link
                      type="sussbmit"
                      className="btn btn-danger me-2 "
                      to={`/sites/`}
                    >
                      Cancel
                    </Link>
                    {isEditPermissionAvailable ? (
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default withApi(SiteSettings);
