import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import withApi from "../../../Utils/ApiHelper";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import { useSelector } from "react-redux";

const ManageSubBusinessTypes = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      const response = await getData("/business/sub-types");
      const { data } = response;
      console.log(apidata, "data");

      if (data) {
        const firstName = data.data?.first_name || "";
        const lastName = data.data?.last_name || "";
        const phoneNumber = data.data?.phone_number || "";
        const fullName = data.data?.full_name || "";

        localStorage.setItem("First_name", firstName);
        localStorage.setItem("Last_name", lastName);
        localStorage.setItem("Phone_Number", phoneNumber);
        localStorage.setItem("full_name", fullName);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    handleFetchData();
    console.clear();
  }, []);
  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filteredData = searchvalue.filter((item) =>
      item.business_sub_name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  const handleFetchData = async () => {
    try {
      const response = await getData("/business/sub-types");

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        setSearchvalue(response.data.data);
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
      const response = await postData(
        "business/update-sub-type-status",
        formData
      );
      // Console log the response
      if (apidata.api_response === "success") {
        handleFetchData();
      }
    } catch (error) {
      console.log(error);
    }
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
        const formData = new FormData();
        formData.append("id", id);
        const DeleteRole = () => {
          const body = {
            formData,
          };
          postData("company/delete", body);
          postData(body);
        };
        DeleteRole();
      }
    });
  };
  const navigate = useNavigate();
  //permissions check
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable =
    permissionsArray?.includes("shop-status-update");
  const isEditPermissionAvailable = permissionsArray?.includes(
    "business-sub-type-edit"
  );
  const isAddPermissionAvailable = permissionsArray?.includes(
    "business-sub-type-create"
  );
  const isDeletePermissionAvailable = permissionsArray?.includes(
    "business-sub-type-delete"
  );
  const isDetailsPermissionAvailable = permissionsArray?.includes(
    "business-sub-type-detail"
  );
  const isAssignPermissionAvailable = permissionsArray?.includes(
    "business-sub-type-assign"
  );

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Business Sub Type",
      selector: (row) => [row.business_sub_name],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.business_sub_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Business  Type",
      selector: (row) => [row.business_type],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.business_type}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Created Date",
      selector: (row) => [row.created_date],
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
      name: "Status",
      selector: (row) => [row.status],
      sortable: true,
      width: "15%",
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
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editsub-business/${row.id}`}
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

  const tableDatas = {
    columns,
    data,
  };

  const Loaderimg = () => {
    return (
      <div id="global-loader">
        <loderdata.Loadersbigsizes1 />
      </div>
    );
  };
  return (
    <>
      {isLoading ? (
        Loaderimg()
      ) : (
        <>
          <div className="page-header ">
            <div>
              <h1 className="page-title">Manage Sub-Business Types</h1>

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
                  Manage Sub-Business Types
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="ms-auto pageheader-btn">
              <div className="input-group">
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Search..."
                  style={{ borderRadius: 0 }}
                />
                {isAddPermissionAvailable ? (
                  <Link to="/addsub-business" className="btn btn-primary ms-2">
                    Add Sub-Business Types <AddCircleOutlineIcon />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

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
              searchable={true}
            />
          </DataTableExtensions>
        </>
      )}
    </>
  );
};
export default withApi(ManageSubBusinessTypes);
