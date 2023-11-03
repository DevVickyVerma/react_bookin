import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../../data/Modal/SideSearchbar";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
// import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CenterSearchmodal from "../../../data/Modal/CenterSearchmodal";
import { Box } from "@mui/system";
import { ErrorAlert } from "../../../Utils/ToastUtils";
const ManageClient = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [searchdata, setSearchdata] = useState({});
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [activeArray, setActiveArray] = useState([]);
  const [SearchList, setSearchList] = useState(false);

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
        const formData = new FormData();
        formData.append("id", id);
        DeleteClient(formData);
      }
    });
  };
  const DeleteClient = async (formData) => {
    try {
      const response = await postData("client/delete", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        handleFetchData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearchReset = () => {
    handleFetchData();
    setSearchdata({});
    setSearchList(true);
  };
  const token = localStorage.getItem("token");
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
  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
  };
  const handleSubmit = (formData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    if (Object.values(filteredFormData).length > 0) {
      setSearchdata(filteredFormData);
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const SearchList = async (row) => {
        try {
          const params = new URLSearchParams(formData).toString();
          const response = await getData(`/client/list?${params}`);

          if (response && response.data && response.data.data) {
            setData(response.data.data.clients);
          } else {
            throw new Error("No data available in the response");
          }
        } catch (error) {
          console.error("API error:", error);
          // Handle the error here, such as displaying an error message or performing other actions
        }
      };

      SearchList();
    }

    handleToggleSidebar1();
  };

  useEffect(() => {
    handleFetchData();
    console.clear();
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/list");

      if (response && response.data && response.data.data) {
        setData(response.data.data.clients);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
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
      const response = await postData("/client/update-status", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        handleFetchData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "client-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("client-edit");
  const isLoginPermissionAvailable = permissionsArray?.includes(
    "client-account-access"
  );
  const isAddonPermissionAvailable =
    permissionsArray?.includes("addons-assign");
  const isAddPermissionAvailable = permissionsArray?.includes("client-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("client-delete");
  const isReportsPermissionAvailable =
    permissionsArray?.includes("report-assign");
  const isAssignPermissionAvailable =
    permissionsArray?.includes("client-assign");
  const anyPermissionAvailable =
    isEditPermissionAvailable ||
    isLoginPermissionAvailable ||
    isAddonPermissionAvailable ||
    isDeletePermissionAvailable ||
    isReportsPermissionAvailable;

  const handleClientLogin = async (row) => {
    try {
      const response = await getData(`/account-login/${row.id}`);

      if (response) {
        localStorage.setItem("token", response.data.data.access_token);
        navigate(UserPermissions?.route);
        const firstName = response.data.data.first_name ?? "";
        const lastName = response.data.data.last_name ?? "";
        const phoneNumber = response.data.data.phone_number ?? "";
        const full_name = response.data.data.client_name ?? "";
        const superiorRole = response.data.data.superiorRole ?? "";
        localStorage.setItem("First_name", firstName);
        localStorage.setItem("full_name", full_name);
        localStorage.setItem("Last_name", lastName);
        localStorage.setItem("Phone_Number", phoneNumber);
        localStorage.setItem("superiorRole", superiorRole);
        setTimeout(function () {
          localStorage.setItem("tokenupdate", "true");
          localStorage.setItem("Client_login", "true");
        }, 1000); // 2000 milliseconds (2 seconds)

        localStorage.removeItem("passData");
        localStorage.removeItem("mySearchData");
        localStorage.removeItem("savedDataOfDashboard");
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
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
      name: "Client",
      selector: (row) => [row.full_name],
      sortable: true,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Addons",
      selector: (row) => [row.addons],
      sortable: true,
      width: "24%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.addons}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
      width: "12%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
        // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: true,
      width: "12%",
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
    anyPermissionAvailable
      ? {
        name: "Action",
        selector: (row) => [row.action],
        sortable: true,
        width: "20%",
        cell: (row) => (
          <span className="text-center">
            {anyPermissionAvailable ? (
              <Dropdown className="dropdown btn-group">
                <Dropdown.Toggle
                  variant="Primary"
                  type="button"
                  className="btn btn-primary dropdown-toggle"
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                  {isEditPermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link to={`/editclient/${row.id}`}>
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <ModeEditIcon />
                          </i>
                          Edit
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isDeletePermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link to="#" onClick={() => handleDelete(row.id)}>
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DeleteIcon />
                          </i>
                          Delete
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isLoginPermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link to="#" onClick={() => handleClientLogin(row)}>
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <VpnKeyIcon />
                          </i>
                          Client Login
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isAddonPermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link to={`/assignclientaddon/${row.id}`}>
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AssignmentIndIcon />
                          </i>
                          Assign Addon
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isReportsPermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link
                        className="settingicon"
                        to={`/assignreport/${row.id}`}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            {""} <AssignmentIndIcon />
                          </i>
                          <span>Report Assign</span>
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </span>
        ),
      }
      : "",
  ];

  const tableDatas = {
    columns,
    data,
  };

  const dynamicClass = "dynamicClass"; /* your dynamic class */
  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title dashboard-page-title">Manage Client</h1>
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
                Manage Client
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn d-flex">
            <Box component="span" display={["none", "flex"]} alignItems={"center"} className="Search-data">
              {Object.entries(searchdata).map(([key, value]) => (
                <div key={key} className="badge">
                  <span className="badge-key">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span className="badge-value">{value}</span>
                </div>
              ))}
            </Box>
            <Link
              // className="btn btn-primary sbsbo"
              onClick={() => {
                handleToggleSidebar1();
              }}
            >
              <CenterSearchmodal
                title="Search"
                visible={sidebarVisible1}
                onClick={() => {
                  handleToggleSidebar1();
                }}
                onClose={handleToggleSidebar1}
                onSubmit={handleSubmit}
                searchListstatus={SearchList}
              />
            </Link>

            {Object.keys(searchdata).length > 0 ? (

              <Link
                className="btn btn-danger ms-2 addclientbtn hide-btn-responsive"
                onClick={handleSearchReset}

              >
                Reset <RestartAltIcon />
              </Link>
            ) : (
              ""
            )}


            {isAddPermissionAvailable ? (
              <Link
                to="/addclient"
                className="btn btn-primary ms-2 addclientbtn"
              >
                <Box component="span" display={["none", "unset"]}>
                  Add
                </Box>  Client {""}
                <AddCircleOutlineIcon />
              </Link>
            ) : null}
          </div>
        </div>

        <Box display={["flex", "none"]} justifyContent={"space-between"} alignItems={"center"} mb={"10px"}>
          <span className="Search-data gap-1 d-flex flex-wrap">
            {Object.entries(searchdata).map(([key, value]) => (
              <div key={key} className="badge">
                <span className="badge-key">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="badge-value">{value}</span>
              </div>
            ))}
          </span>

          {Object.keys(searchdata).length > 0 ? (
            <Link
              className="btn btn-danger ms-2 addclientbtn"
              onClick={handleSearchReset}
              style={{ minWidth: "80px" }}
            >
              Reset <RestartAltIcon />
            </Link>
          ) : (
            ""
          )}
        </Box>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Client</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
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
                          pagination
                          highlightOnHover
                          searchable={false}
                          className={dynamicClass}
                        // className="custom-datatable" // Add your custom class here
                        />
                      </DataTableExtensions>
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

export default withApi(ManageClient);
