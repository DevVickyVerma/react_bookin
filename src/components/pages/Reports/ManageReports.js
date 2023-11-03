import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import { MultiSelect } from "react-multi-select-component";
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";

import { useSelector } from "react-redux";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";

import { Slide, toast } from "react-toastify";
import Switch from "react-switch";

const ManageReports = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  const [ReportList, setReportList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [ShowButton, setShowButton] = useState(false);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);

  const [ReportDownloadUrl, setReportDownloadUrl] = useState();
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [ReportCode, setReportCode] = useState("");

  const [toggleValue, setToggleValue] = useState(false); // State for the toggle
  const handleToggleChange = (checked) => {
    setToggleValue(checked);
    setShowButton(false);
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));

    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const FetchReportList = async (id) => {
    try {
      const response = await getData(`client/reportlist?client_id=${id}`);

      const { data } = response;
      if (data) {
        setReportList(response?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit1 = async (formValues) => {
    try {
      const formData = new FormData();

      formData.append("report", formValues.report);

      formData.append("report", formValues.report);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", formValues.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      formData.append("company_id", formValues.company_id);

      formData.append("start_date", formValues.start_date);
      formData.append("end_date", formValues.end_date);

      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${formValues.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
      }
      if (
        selected === undefined ||
        selected === null ||
        (Array.isArray(selected) && selected.length === 0)
      ) {
        ErrorToast("Please select at least one site");
      }

      // Assuming you have an array of selected values in the 'selected' state
      const selectedSiteIds = selected?.map((site) => site.value);
      const selectedSiteIdParams = selectedSiteIds
        .map((id) => `site_id[]=${id}`)
        .join("&");

      // Now 'selectedSiteIdParams' contains the query parameter string for selected site IDs

      const commonParams = toggleValue
        ? `/report/${formValues.report}?${clientIDCondition}company_id=${formValues.company_id}&${selectedSiteIdParams}&from_date=${formValues.start_date}&to_date=${formValues.end_date}`
        : `/report/${formValues.report}?${clientIDCondition}company_id=${formValues.company_id}&${selectedSiteIdParams}&month=${formValues.reportmonth}`;

      try {
        const response = await getData(commonParams);

        if (response.status === 200) {
          setShowButton(true);
          // Console log the response
          setReportDownloadUrl(commonParams);
        }

        if (apidata && apidata.api_response === "success") {
          setReportDownloadUrl(commonParams);
          setShowButton(true);
        }
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    } catch (error) {
      console.log(error);
      // Set the submission state to false if an error occurs
    }
  };

  function handleReportClick(item) {
    console.log(item, "item");
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const handleShowDate1 = () => {
    const inputDateElement = document.querySelector("#end_date");
    inputDateElement.showPicker();
  };
  const [selected, setSelected] = useState([]);

  const options = SiteList?.map((site) => ({
    label: site.site_name,
    value: site.id,
  }));

  const formik = useFormik({
    initialValues: {
      report: "1",
      client_id: "",
      company_id: "",
      sites: [],
      start_date: "",
      end_date: "",
      reportmonth: "",
    },
    validationSchema: Yup.object({
      report: Yup.string().required("Report is required"),
      company_id: Yup.string().required("Company is required"),
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
      fetchCommonListData();
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
      FetchReportList(clientId);
    }
  }, []);
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Report</h1>
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
                Report
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Report</h3>
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
                            className={`input101 ${
                              formik.errors.client_id &&
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
                              FetchReportList(selectedType);
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
                          className={`input101 ${
                            formik.errors.company_id &&
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
                      <FormGroup>
                        <label className="form-label mt-4">
                          Select Sites
                          <span className="text-danger">*</span>
                        </label>
                        <MultiSelect
                          value={selected}
                          onChange={setSelected}
                          labelledBy="Select Sites"
                          disableSearch="true"
                          options={options}
                          showCheckbox="false"
                        />
                      </FormGroup>
                    </Col>

                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="report">
                          Report
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${
                            formik.errors.report && formik.touched.report
                              ? "is-invalid"
                              : ""
                          }`}
                          id="report"
                          name="report"
                          onChange={(e) => {
                            const selectedreport = e.target.value;
                            setReportCode(e.target.value);
                            formik.setFieldValue("report", selectedreport);
                            setShowButton(false);
                          }}
                        >
                          <option value="">Select a Report</option>
                          {ReportList.data &&
                          ReportList?.data?.reports.length > 0 ? (
                            ReportList?.data?.reports.map((item) => (
                              <option
                                key={item.id}
                                value={item.report_code}
                                onClick={() => handleReportClick(item)}
                              >
                                {item.report_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Report</option>
                          )}
                        </select>

                        {formik.errors.report && formik.touched.report && (
                          <div className="invalid-feedback">
                            {formik.errors.report}
                          </div>
                        )}
                      </div>
                    </Col>
                    {toggleValue ? (
                      <>
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="start_date"
                              className="form-label mt-4"
                            >
                              Start Date
                            </label>
                            <input
                              type="date"
                              min={"2023-01-01"}
                              max={getCurrentDate()}
                              onClick={handleShowDate}
                              className={`input101 ${
                                formik.errors.start_date &&
                                formik.touched.start_date
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="start_date"
                              name="start_date"
                              onChange={(e) => {
                                const selectedstart_date = e.target.value;

                                formik.setFieldValue(
                                  "start_date",
                                  selectedstart_date
                                );
                                setShowButton(false);
                              }}
                              value={formik.values.start_date}
                            ></input>
                            {formik.errors.start_date &&
                              formik.touched.start_date && (
                                <div className="invalid-feedback">
                                  {formik.errors.start_date}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="end_date"
                              className="form-label mt-4"
                            >
                              End Date
                            </label>
                            <input
                              type="date"
                              min={"2023-01-01"}
                              max={getCurrentDate()}
                              onClick={handleShowDate1}
                              className={`input101 ${
                                formik.errors.end_date &&
                                formik.touched.end_date
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="end_date"
                              name="end_date"
                              onChange={(e) => {
                                const selectedend_date_date = e.target.value;

                                formik.setFieldValue(
                                  "end_date",
                                  selectedend_date_date
                                );
                                setShowButton(false);
                              }}
                              value={formik.values.end_date}
                            ></input>
                            {formik.errors.end_date &&
                              formik.touched.end_date && (
                                <div className="invalid-feedback">
                                  {formik.errors.end_date}
                                </div>
                              )}
                          </div>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}

                    {!toggleValue ? (
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="reportmonth"
                          >
                            Months
                          </label>
                          <select
                            as="select"
                            className={`input101 ${
                              formik.errors.reportmonth &&
                              formik.touched.reportmonth
                                ? "is-invalid"
                                : ""
                            }`}
                            id="reportmonth"
                            name="reportmonth"
                            onChange={(e) => {
                              const selectedmonth = e.target.value;

                              formik.setFieldValue(
                                "reportmonth",
                                selectedmonth
                              );
                              setShowButton(false);
                            }}
                            value={formik.values.reportmonth}
                          >
                            <option value="">Select a Month</option>
                            {ReportList.data &&
                            ReportList?.data?.months.length > 0 ? (
                              ReportList?.data?.months.map((item) => (
                                <option
                                  key={item.value}
                                  value={item.value}
                                  onClick={() => handleReportClick(item)} // Modified line
                                >
                                  {item.display}
                                </option>
                              ))
                            ) : (
                              <option disabled>No reportmonth</option>
                            )}
                          </select>

                          {formik.errors.reportmonth &&
                            formik.touched.reportmonth && (
                              <div className="invalid-feedback">
                                {formik.errors.reportmonth}
                              </div>
                            )}
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  <Row>
                    <Col lg={12} md={12}>
                      <div className="form-group">
                        <label className="form-label mt-4">
                          Get Reports By Date{" "}
                        </label>
                        <Switch
                          id="customToggle"
                          checked={toggleValue}
                          onChange={handleToggleChange}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Card.Footer className="text-end ">
                    <button type="submit" className="btn btn-primary mx-2">
                      Generate Report
                    </button>
                    {ShowButton ? (
                      <button
                        onClick={() => {
                          window.open(
                            process.env.REACT_APP_BASE_URL + ReportDownloadUrl,
                            "_blank",
                            "noopener noreferrer"
                          );
                        }}
                        className="btn btn-danger me-2"
                        type="button"
                      >
                        Download Report
                      </button>
                    ) : (
                      ""
                    )}
                  </Card.Footer>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageReports);
