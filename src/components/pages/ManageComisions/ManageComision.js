import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";

import withApi from "../../../Utils/ApiHelper";

import { useSelector } from "react-redux";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [SelectedsiteID, setsiteID] = useState();
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [editable, setis_editable] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "supplier-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("supplier-edit");
  const isAddPermissionAvailable =
    permissionsArray?.includes("supplier-create");



  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();

      formData.append("start_date", values.start_date);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }
      formData.append("company_id", values.company_id);
      formData.append("site_id", values.site_id);
      setsiteID(values.site_id);

      try {
        const response2 = await getData(
          `/shop-commission?site_id=${values.site_id}`
        );

        const { data } = response2;
        if (data) {
          setData(data.data.items);
          setis_editable(data.data);

          // Create an array of form values based on the response data
          const formValues = data.data.items.map((item) => {
            return {
              id: item.department_item_id,
              commission: item.commission,
              name: item.name,
            };
          });

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      name: " CATEGORY NAME",
      selector: (row) => row.name,
      sortable: false,
      width: "40%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name !== undefined ? `${row.name}` : ""}
        </span>
      ),
    },
    {
      name: "COMMISSION",
      selector: (row) => row.commission,
      sortable: false,
      width: "60%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.commission}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`commission-${index}`}
              name={`data[${index}].commission`}
              className=" table-input"
              value={formik.values.data[index]?.commission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];
  const handleSubmit = async (values) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      values.data.forEach((obj) => {
        const id = obj.id;
        const grossValueKey = `commission[${id}]`;

        const grossValue = obj.commission;

        // const action = obj.action;

        formData.append(grossValueKey, grossValue);
      });

      formData.append("site_id", SelectedsiteID);

      const postDataUrl = "/shop-commission/update";
      const navigatePath = "/business";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error);
    }
  };

  const tableDatas = {
    columns,
    data,
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  const formik2 = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
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
        <div className="page-header ">
          <div>
            <h1 className="page-title">Shop Commission</h1>
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
                Shop Commission
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                {/* <Formik
                  initialValues={{
                    client_id: "",
                    company_id: "",
                    site_id: "",
                    start_date: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                            <Col lg={4} md={6}>
                              <FormGroup>
                                <label
                                  htmlFor="client_id"
                                  className=" form-label mt-4"
                                >
                                  Client
                                  <span className="text-danger">*</span>
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="client_id"
                                  name="client_id"
                                  onChange={(e) => {
                                    const selectedType = e.target.value;
                                    setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);

                                    // Reset the selected company and site
                                    setSelectedCompanyList([]);
                                    setSelectedSiteList([]);
                                    setFieldValue("company_id", "");
                                    setFieldValue("site_id", "");

                                    const selectedClient =
                                      AddSiteData.data.find(
                                        (client) => client.id === selectedType
                                      );

                                    if (selectedClient) {
                                      setSelectedCompanyList(
                                        selectedClient.companies
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Select a Client</option>
                                  {AddSiteData.data &&
                                  AddSiteData.data.length > 0 ? (
                                    AddSiteData.data.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.client_name}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>No Client</option>
                                  )}
                                </Field>

                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="client_id"
                                />
                              </FormGroup>
                            </Col>
                          )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Company
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.company_id && touched.company_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="company_id"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                  setFieldValue("company_id", selectedCompany);
                                  setSelectedSiteList([]);
                                  const selectedCompanyData =
                                    selectedCompanyList.find(
                                      (company) =>
                                        company.id === selectedCompany
                                    );
                                  if (selectedCompanyData) {
                                    setSelectedSiteList(
                                      selectedCompanyData.sites
                                    );
                                  }
                                }}
                              >
                                <option value="">Select a Company</option>
                                {selectedCompanyList.length > 0 ? (
                                  selectedCompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Company</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_id"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="site_id"
                                className="form-label mt-4"
                              >
                                Site
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.site_id && touched.site_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="site_id"
                                name="site_id"
                              >
                                <option value="">Select a Site</option>
                                {selectedSiteList.length > 0 ? (
                                  selectedSiteList.map((site) => (
                                    <option key={site.id} value={site.id}>
                                      {site.site_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Site</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="site_id"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/dashboard/`}
                        >
                          Reset
                        </Link>
                        <button className="btn btn-primary me-2" type="submit">
                          Submit
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik> */}

                <form onSubmit={formik2.handleSubmit}>
                  <Card.Body>
                    <Row>
                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={4}>
                          <div className="form-group">
                            <label
                              htmlFor="client_id"
                              className="form-label mt-4"
                            >
                              Client
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${formik2.errors.client_id &&
                                formik2.touched.client_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="client_id"
                              name="client_id"
                              value={formik2.values.client_id}
                              onChange={(e) => {
                                const selectedType = e.target.value;
                                console.log(selectedType, "selectedType");

                                if (selectedType) {
                                  GetCompanyList(selectedType);
                                  formik2.setFieldValue("client_id", selectedType);
                                  setSelectedClientId(selectedType);
                                  setSiteList([]);
                                  formik2.setFieldValue("company_id", "");
                                  formik2.setFieldValue("site_id", "");
                                } else {
                                  console.log(
                                    selectedType,
                                    "selectedType no values"
                                  );
                                  formik2.setFieldValue("client_id", "");
                                  formik2.setFieldValue("company_id", "");
                                  formik2.setFieldValue("site_id", "");

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

                            {formik2.errors.client_id &&
                              formik2.touched.client_id && (
                                <div className="invalid-feedback">
                                  {formik2.errors.client_id}
                                </div>
                              )}
                          </div>
                        </Col>
                      )}

                      <Col Col lg={4} md={4}>
                        <div className="form-group">
                          <label htmlFor="company_id" className="form-label mt-4">
                            Company
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik2.errors.company_id &&
                              formik2.touched.company_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="company_id"
                            name="company_id"
                            value={formik2.values.company_id}
                            onChange={(e) => {
                              const selectcompany = e.target.value;

                              if (selectcompany) {
                                GetSiteList(selectcompany);
                                formik2.setFieldValue("site_id", "");
                                setSelectedCompanyId(selectcompany);
                                formik2.setFieldValue("company_id", selectcompany);
                              } else {
                                formik2.setFieldValue("company_id", "");
                                formik2.setFieldValue("site_id", "");

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
                          {formik2.errors.company_id &&
                            formik2.touched.company_id && (
                              <div className="invalid-feedback">
                                {formik2.errors.company_id}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={4}>
                        <div className="form-group">
                          <label htmlFor="site_id" className="form-label mt-4">
                            Site Name
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik2.errors.site_id && formik2.touched.site_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="site_id"
                            name="site_id"
                            value={formik2.values.site_id}
                            onChange={(e) => {
                              const selectedsite_id = e.target.value;

                              formik2.setFieldValue("site_id", selectedsite_id);
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
                          {formik2.errors.site_id && formik2.touched.site_id && (
                            <div className="invalid-feedback">
                              {formik2.errors.site_id}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/dashboard`}
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Shop Commission</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="table-responsive deleted-table">
                        <DataTableExtensions {...tableDatas}>
                          <DataTable
                            columns={columns}
                            data={data}
                            noHeader
                            defaultSortField="id"
                            defaultSortAsc={false}
                            striped={true}
                            persistTableHead
                            highlightOnHover
                            searchable={false}
                          />
                        </DataTableExtensions>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        {editable ? (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        ) : (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        )}
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageDsr);
