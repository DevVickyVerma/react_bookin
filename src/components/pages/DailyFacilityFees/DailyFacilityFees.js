import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from "react-redux";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomClient from "../../../Utils/CustomClient";

const SiteSettings = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [ClientList, setClientList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [ToleranceData, setToleranceData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [CompanyList, setCompanyList] = useState([]);
  const [data, setData] = useState();
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const isEditPermissionAvailable = permissionsArray?.includes(
    "shop-update-facility-fees"
  );
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array?.isArray(error?.response?.data?.message)
        ? error?.response?.data?.message?.join(" ")
        : error?.response?.data?.message;
      ErrorAlert(errorMessage);
    }
  }

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

  const handleSubmit = async (values) => {
    let clientIDCondition = "";
    if (localStorage.getItem("superiorRole") !== "Client") {
      clientIDCondition = `client_id=${formik.values.client_id}&`;
    } else {
      clientIDCondition = `client_id=${clientIDLocalStorage}&`;
    }

    try {
      const response = await getData(
        `/daily-facility-fees/?${clientIDCondition}&company_id=${values.company_id}`
      );
      const { data } = response;
      if (data) {
        setData(data?.data);
        const formValues = data?.data.map((item) => {
          return {
            charge_id: item.charge_id,
            date: item.date,
            site_id: item.site_id,
            site_name: item.site_name,
            value: item.value,
          };
        });

        formik.setFieldValue("data", formValues);

        // Process the API response and update your state or perform other actions
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle error if the API call fails
    }
  };

  const formik = useFormik({
    initialValues: {
      company_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),

    onSubmit: handleSubmit,
  });
  const columns = [
    {
      name: "SITE NAME",
      selector: (row) => row.site_name,
      sortable: false,
      width: "33%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.site_name !== undefined ? `${row.site_name}` : ""}
        </span>
      ),
    },
    {
      name: "CREATED DATE",
      selector: (row) => row.date,
      sortable: false,
      width: "33%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.date !== undefined ? `${row.date}` : ""}
        </span>
      ),
    },

    {
      name: "VALUE",
      selector: (row) => row.value,
      sortable: false,
      width: "33%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.value}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`value-${index}`}
              name={`data[${index}].value`}
              className="table-input"
              value={formik?.values?.data && formik.values.data[index]?.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];
  const tableDatas = {
    columns,
    data,
  };
  const handleSubmitForm1 = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formik.values.data.forEach((obj) => {
        const id = obj.site_id;
        const values = obj.value;
        const charges_price = `charges[${id}]`;

        const platts_price_Value = values;

        // const action = obj.action;

        formData.append(charges_price, platts_price_Value);
      });

      const postDataUrl = "/daily-facility-fees/update";
      const navigatePath = "/business";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Daily Facility Fees</h1>
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
                Daily Facility Fees
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Daily Facility Fees</Card.Title>
              </Card.Header>

              <div class="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <CustomClient
                      formik={formik}
                      lg={4}
                      md={6}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={4}
                      md={6}
                      CompanyList={CompanyList}
                      setSelectedCompanyId={setSelectedCompanyId}
                      setSiteList={setSiteList}
                      selectedClientId={selectedClientId}
                      GetSiteList={GetSiteList}
                    />

                  </Row>
                  <div className="text-end">
                    <Link
                      type="sussbmit"
                      className="btn btn-danger me-2 "
                      to={`/sites/`}
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
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Daily Facility Fees</Card.Title>
              </Card.Header>

              <div class="card-body">
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={handleSubmitForm1}>
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
                      {isEditPermissionAvailable ? (
                        <div className="d-flex justify-content-end mt-3">
                          {data ? (
                            <button className="btn btn-primary" type="submit">
                              Submit
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
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
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default withApi(SiteSettings);
