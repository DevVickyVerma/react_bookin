import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import DataTable from "react-data-table-component";

import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Box } from "@mui/material";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import CustomClient from "../../../Utils/CustomClient";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomSite from "../../../Utils/CustomSite";

const Competitor = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [SiteId, setSiteId] = useState();
  const [SupplierData, setSupplierData] = useState({});

  const [CompetitorList, setCompetitorList] = useState();
  // const [storedDataInLocal, setStoredDataInLocal] = useState();

  const UserPermissions = useSelector((state) => state?.data?.data);

  const [permissionsArray, setPermissionsArray] = useState([]);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isAddPermissionAvailable =
    permissionsArray?.includes("competitor-create");

  const isDeletePermissionAvailable =
    permissionsArray?.includes("competitor-delete");
  const isEditPermissionAvailable =
    permissionsArray?.includes("competitor-edit");

  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const GetSiteData = async () => {
      try {
        const response = await axiosInstance.get("suppliers");

        if (response.data) {
          setSupplierData(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    console.clear();
  }, []);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site  is required"),
    }),

    onSubmit: (values) => {
      // const formData = {
      //   client_id: values.client_id,
      //   company_id: values.company_id,
      //   site_id: values.site_id,
      // };
      // // Serialize the object to a JSON string
      // const competitorId = JSON.stringify(formData);

      // // Store the JSON string in local storage
      // localStorage.setItem("competitorId", competitorId);

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

  const handleSubmit = async (values) => {
    try {
      const competitor = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };
      localStorage.setItem("manageCompetitor", JSON.stringify(competitor));
      const response = await getData(
        `site/competitor/list?site_id=${values?.site_id}`
      );

      if (response && response.data && response.data.data) {
        setCompetitorList(response.data.data.competitors);
      } else {
        throw new Error("No data available in the response");

      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");
    if (localStorage.getItem("manageCompetitor")) {
      let parsedDataFromLocal = JSON.parse(
        localStorage.getItem("manageCompetitor")
      ) ? JSON.parse(
        localStorage.getItem("manageCompetitor")
      ) : "null"

      formik.setFieldValue("client_id", parsedDataFromLocal?.client_id || "")
      formik.setFieldValue("company_id", parsedDataFromLocal?.company_id || "")
      formik.setFieldValue("site_id", parsedDataFromLocal?.site_id || "")
      setSiteId(parsedDataFromLocal?.site_id)
      GetCompanyList(parsedDataFromLocal?.client_id ? parsedDataFromLocal?.client_id : clientId)
      GetSiteList(parsedDataFromLocal?.company_id ? parsedDataFromLocal?.company_id : null)
      handleSubmit(parsedDataFromLocal)
    }
  }, [])

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("id", id);

        const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const DeleteRole = async () => {
          try {
            const response = await axiosInstance.post(
              "/site/competitor/delete",
              formData
            );
            setCompetitorList(response.data.data);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            handleSubmit();
            // FetchmannegerList();
          } catch (error) {
            handleError(error);
          } finally {
          }
          // setIsLoading(false);
        };
        DeleteRole();
      }
    });
  };
  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    const newStatus = row.status === 1 ? 0 : 1;
    formData.append("status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      const response = await postData(
        "/site/competitor/update-status",
        formData
      );

      if (apidata.api_response === "success") {
        handleSubmit();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "7%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Name",
      selector: (row, index) => [row.name],
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Suppliers",
      selector: (row) => [row.supplier],
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.supplier}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      // selector: "created_date",
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Address",
      selector: (row) => [row.address],
      // selector: "created_date",
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.address}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: true,
      width: "11%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Inactive
              </button>
            ) : (
              <button
                className="badge"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Unknown
              </button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "27%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/edit-competitor/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 me-2"
              >
                <i>
                  <svg
                    className="table-edit"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11"
                onClick={() => handleDelete(row.id)}
              >
                <i>
                  <svg
                    className="table-delete"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title ">Manage Competitor</h1>
            <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
                Manage Competitor
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="ms-auto ">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addCompetitor"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  <Box component="span" display={["none", "unset"]} m="{1}">
                    Add
                  </Box>{" "}
                  Competitor
                  <AddCircleOutlineIcon />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Manage Competitor</Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <CustomClient
                      formik={formik}
                      lg={4}
                      md={4}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={4}
                      md={4}
                      CompanyList={CompanyList}
                      setSelectedCompanyId={setSelectedCompanyId}
                      setSiteList={setSiteList}
                      selectedClientId={selectedClientId}
                      GetSiteList={GetSiteList}
                    />

                    <CustomSite
                      formik={formik}
                      lg={4}
                      md={3}
                      SiteList={SiteList}
                      setSelectedSiteId={setSelectedSiteId}
                      CompanyList={CompanyList}
                      setSiteId={setSiteId}
                    />
                  </Row>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* here is my listing data table */}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Competitor Listing Data</h3>
              </Card.Header>
              <Card.Body>
                {CompetitorList?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={CompetitorList}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        pagination
                        highlightOnHover
                        searchable={false}
                      />
                    </div>
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

export default withApi(Competitor);
