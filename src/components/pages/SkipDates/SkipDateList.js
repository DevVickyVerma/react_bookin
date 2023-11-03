import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import DatePicker from "react-multi-date-picker";
import { AiOutlineClose } from "react-icons/ai";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const ManageRoles = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

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
              "/site/skip-date/delete",
              formData
            );
            setData(response.data.data);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            FetchmannegerList();
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
  const { id } = useParams();

  const FetchmannegerList = async () => {
    try {
      const response = await getData(
        `/site/skip-date/list?site_id=${id}&page=${currentPage}` // Use '&' instead of '?'
      );

      if (response && response.data) {
        setData(response.data.data.skipDates);
        setCount(response.data.data.count);
        setCurrentPage(response.data.data.currentPage);
        setHasMorePages(response.data.data.hasMorePages);

        setLastPage(response.data.data.lastPage);
        setPerPage(response.data.data.perPage);
        setTotal(response.data.data.total);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
  }, [currentPage]);

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const isAddPermissionAvailable =
    permissionsArray?.includes("skipdate-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("skipdate-delete");

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
      name: "Skip Date",
      selector: (row) => [row.skip_date],
      sortable: true,
      width: "35%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
        // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.skip_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
      width: "35%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <span className="text-center">
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


  const [showModal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDateSelection = (dates) => {
    setSelectedDates(dates);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert timestamps to "YYYY-MM-DD" format
    const formatted = selectedDates.map((timestamp) => {
      const date = new Date(timestamp);
      return formatDate(date);
    });

    setFormattedDates(formatted);

    if (formatted.length > 0) {
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the formattedDates array to the formData
        formatted.forEach((date, index) => {
          formData.append(`skip_date[${index}]`, date);
        });
        formData.append("site_id", id);

        const response = await postData(`site/skip-date/add`, formData);

        // Console log the response
        if (apidata.api_response === "success") {
          console.log(response);
          handleCloseModal();
          FetchmannegerList();
          console.log(formData, "formData");
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      ErrorAlert("Please select atleast one date");
    }
  };

  const maxPagesToShow = 5; // Adjust the number of pages to show in the center
  const pages = [];

  // Calculate the range of pages to display
  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

  // Handle cases where the range is near the beginning or end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  // Render the pagination items
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  if (startPage > 1) {
    pages.unshift(<Pagination.Ellipsis key="ellipsis-start" disabled />);
  }

  if (endPage < lastPage) {
    pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
  }

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Skip Dates </h1>
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
                Skip Dates
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  //   to={`/addmanager/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                  onClick={openModal}
                >
                  Add Skip Dates
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Skip Dates </h3>
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
                          //   pagination
                          //   paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
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
              {data?.length > 0 ? (
                <>
                  <Card.Footer>
                    <div style={{ float: "right" }}>
                      <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        {pages}
                        <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === lastPage}
                        />
                        <Pagination.Last
                          onClick={() => handlePageChange(lastPage)}
                        />
                      </Pagination>
                    </div>
                  </Card.Footer>
                </>
              ) : (
                <></>
              )}
            </Card>
          </Col>
        </Row>
        <Dialog
          open={showModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          md={{ minHeight: "700px" }}
          style={{ minHeight: "700px" }}
        >
          {/* <DialogTitle
            style={{ background: "#6259ca", color: "#fff", padding: "8px" }}
          >
            Set Skiped Dates
          </DialogTitle> */}
          <Modal.Header
            style={{
              color: "#fff",
              background: "#6259ca",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Modal.Title style={{ margin: "0px" }}>
                {" "}
                Set Skiped Dates
              </Modal.Title>
            </div>
            <div>
              <span
                className="modal-icon"
                onClick={handleCloseModal}
                style={{ cursor: "pointer" }}
              >
                <AiOutlineClose />
              </span>
            </div>
          </Modal.Header>
          <DialogContent
            style={{ marginBottom: "200px", width: "100%" }}
            md={{ minHeight: "700px" }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100% !important" }}>
              <Form.Label className="form-label mt-4">
                Select Skip Dates
              </Form.Label>
              <DatePicker
                className="form-control"
                placeholder="Select Skip Dates"
                value={selectedDates}
                onChange={handleDateSelection}
                multiple
                numberOfMonths={1}
                style={{ width: "100%" }}
              />
            </form>
          </DialogContent>
          <hr></hr>
          <DialogActions>
            <button
              className="btn btn-primary me-2"
              type="submit"
              onClick={handleSubmit}
              color="primary"
            >
              {" "}
              Submit
            </button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};
export default withApi(ManageRoles);
