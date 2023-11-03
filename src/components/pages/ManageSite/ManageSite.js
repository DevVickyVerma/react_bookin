import React, { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import CommonSidebar from "../../../data/Modal/CommonSidebar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CenterSearchmodal from "../../../data/Modal/CenterSearchmodal";
import { Box } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { ErrorAlert } from "../../../Utils/ToastUtils";
const ManageSite = (props) => {
  const { apidata, isLoading, getData, postData } = props;

  const [data, setData] = useState();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [sidebardata, setSideData] = useState();
  const [searchdata, setSearchdata] = useState({});
  const [SearchList, setSearchList] = useState(false);
  const [sidebardataobject, setSideDataobject] = useState();


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

  const handleToggleSidebar = async (row) => {
    await getSiteDetails(row);
    setSideData(row.site_name);
    setSidebarVisible(!sidebarVisible);
  };

  const getSiteDetails = async (row) => {
    try {
      const response = await getData("/site/detail/?id=" + row.id);

      if (response.data && response.data.data) {
        setSideDataobject(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

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
            const response = await axiosInstance.post("/site/delete", formData);
            setData(response.data.data);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            FetchTableData();
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

    const newStatus = row.site_status === 1 ? 0 : 1;
    formData.append("site_status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      const response = await postData("/site/update-status", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const FetchTableData = async () => {
    try {
      const response = await getData("/site/list");

      if (response && response.data && response.data.data.sites) {
        setData(response.data.data.sites);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const permissionsToCheck = [
    "site-list",
    "site-create",
    "site-status-update",
    "site-edit",
    "site-delete",
  ];
  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
    console.clear();
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("site-edit");
  const isBankManagerPermissionAvailable =
    permissionsArray?.includes("bankmanager-list");
  const isManagerPermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );
  const issitesettingPermissionAvailable =
    permissionsArray?.includes("site-setting");
  const isAddPermissionAvailable = permissionsArray?.includes("site-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("site-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("site-detail");
  const isSkipDatePermissionAvailable =
    permissionsArray?.includes("skipdate-list");
  const isAssignPermissionAvailable = permissionsArray?.includes("site-assign");
  const anyPermissionAvailable =
    isEditPermissionAvailable ||
    isDeletePermissionAvailable ||
    isManagerPermissionAvailable ||
    issitesettingPermissionAvailable;

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
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "18%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "pointer" }}
          onClick={
            isDetailsPermissionAvailable ? () => handleToggleSidebar(row) : null
          }
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold Tablename" variant="primary">
              {row.site_name}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: " Client",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "15%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {row.site_owner.client_name}
                  </h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold"> ---</h6>
                )}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error:", error);
          return <h6 className="mb-0 fs-14 fw-semibold">Error</h6>;
        }
      },
    },

    {
      name: "Company",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "19%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {row.site_owner.company_name}
                  </h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold">----</h6>
                )}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error:", error);
          return <h6 className="mb-0 fs-14 fw-semibold">Error</h6>;
        }
      },
    },

    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
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
      sortable: false,
      width: "12%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.site_status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.site_status === 0 ? (
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
        sortable: false,
        width: "17%",
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
                <Dropdown.Menu className="dropdown-menu" style={{ margin: "0px !important", padding: "0px !important" }}>
                  {issitesettingPermissionAvailable ? (
                    <Dropdown.Item
                      //  className="dropdown-item"
                      className=" p-0 m-0"
                    >
                      <Link to={`/site-setting/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <SettingsIcon />
                          </i>
                          Settings
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isManagerPermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/assignmanger/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }} >
                          <i className="setting-icon">
                            <AssignmentTurnedInIcon />
                          </i>
                          Assign Manager
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isSkipDatePermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/skipdates/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DateRangeIcon />
                          </i>
                          Skip Date
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isBankManagerPermissionAvailable ? (
                    <Dropdown.Item className=" p-0 m-0"
                    //  className="dropdown-item"
                    >
                      <Link to={`/managebank/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AccountBalanceIcon />
                          </i>
                          Bank Manager
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isEditPermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/editsite/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <ModeEditIcon />
                          </i>
                          Edit
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}

                  {isDeletePermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to="#" onClick={() => handleDelete(row.id)}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DeleteIcon />
                          </i>
                          Delete
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              ""
            )}
          </span>
        ),
      }
      : "",
  ];

  const tableDatas = {
    columns,
    data,
  };

  useEffect(() => {
    FetchTableData();
    console.clear();
  }, []);

  const handleSearchReset = () => {
    FetchTableData();
    setSearchdata({});
    setSearchList(true);
  };

  const handleSubmit = (formData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    if (Object.values(filteredFormData).length > 0) {
      setSearchdata(filteredFormData);

      const SearchList = async (row) => {
        try {
          const params = new URLSearchParams(formData).toString();
          const response = await getData(`/site/list?${params}`);

          if (response && response.data && response.data.data) {
            setData(response.data.data.sites);
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

    // Clear the form input values
    // Resetting the formData to an empty object

    handleToggleSidebar1();
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header d-flex manageSite-header">
          <div>
            <h1 className="page-title dashboard-page-title">Manage Site</h1>

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
                Manage Site
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div
            className="ms-auto pageheader-btn"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              // gap: "10px",
            }}
          >
            <Box
              display={["none", "flex"]}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
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
                  className="btn btn-danger  ms-2"
                  onClick={handleSearchReset}
                  style={{ width: "100px" }}
                >
                  Reset <RestartAltIcon />
                </Link>
              ) : (
                ""
              )}
            </Box>

            <Link
              // style={{ marginBottom: "7px" }}
              onClick={() => {
                handleToggleSidebar1();
              }}
              className="btn-sm"
            >
              <span className="ms-2">
                <CenterSearchmodal
                  title="Search"
                  visible={sidebarVisible1}
                  onClick={() => {
                    handleToggleSidebar1();
                  }}
                  onClose={handleToggleSidebar1}
                  onSubmit={handleSubmit}
                  searchListstatus={SearchList}
                />{" "}
              </span>
            </Link>

            {isAddPermissionAvailable ? (
              <Link to="/addsite" className="btn btn-primary">
                <Box component="span" display={["none", "unset"]}>
                  Add
                </Box>{" "}
                Site <AddCircleOutlineIcon />
              </Link>
            ) : null}
          </div>
        </div>

        <Box
          display={["flex", "none"]}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"10px"}
        >
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
              className="btn btn-danger  ms-2"
              onClick={handleSearchReset}
              style={{ width: "100px" }}
            >
              Reset <RestartAltIcon />
            </Link>
          ) : (
            ""
          )}
        </Box>

        <Suspense fallback={<img src={Loaderimg} alt="Loading" />}>
          <CommonSidebar
            title={sidebardata}
            sidebarContent={sidebardataobject}
            visible={sidebarVisible}
            onClose={handleCloseSidebar}
          />
        </Suspense>
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Site</h3>
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
                          // center={true}
                          persistTableHead
                          pagination
                          paginationPerPage={20}
                          highlightOnHover
                          searchable={false}
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

export default withApi(ManageSite);
