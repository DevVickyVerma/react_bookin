import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@mui/icons-material/Sort";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import WorkflowExceptionFilter from "../../../data/Modal/DsrFilterModal";
import { Box } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
const ManageEmail = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [formValues, setFormValues] = useState(null);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (formValues === null) {
      FetchTableData(currentPage);
    }
    // console.clear();
  }, [currentPage, formValues]);

  const FetchTableData = async (pageNumber) => {
    try {
      const response = await getData(`/drs/api-logs?page=${currentPage}`);
      setData(response?.data?.data?.logs);
      setCount(response.data.data.count);
      setCurrentPage(response?.data?.data?.currentPage);
      setHasMorePages(response?.data?.data?.hasMorePages);

      setLastPage(response?.data?.data?.lastPage);
      setPerPage(response?.data?.data?.perPage);
      setTotal(response?.data?.data?.total);
    } catch (error) {
      console.error("API error:", error);
    }
  };

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
      name: "Site",
      selector: (row) => [row?.site],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Api Type",
      selector: (row) => [row?.api_type],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.api_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Data Import Type",
      selector: (row) => [row?.data_import_type],
      sortable: false,
      width: "10%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.data_import_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Hit Type",
      selector: (row) => [row?.hit_type],
      sortable: false,
      width: "10%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.hit_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Log Date",
      selector: (row) => [row?.log_date],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.log_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row?.status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === "Success" ? (
              <button className="btn btn-success btn-sm">Success</button>
            ) : row.status === "Error" ? (
              <button className="btn btn-danger btn-sm">Error</button>
            ) : (
              <button className="badge">Unknown</button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFetchSiteData = async (values) => {
    try {
      const response = await getData(
        `/drs/api-logs?site_id=${values?.site_id}&drs_date=${values?.start_date}&page=${currentPage}`
      );
      setData(response?.data?.data?.logs);
      setCount(response.data.data.count);
      setCurrentPage(response?.data?.data?.currentPage);
      setHasMorePages(response?.data?.data?.hasMorePages);

      setLastPage(response?.data?.data?.lastPage);
      setPerPage(response?.data?.data?.perPage);
      setTotal(response?.data?.data?.total);
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleFormSubmit = (values) => {
    closeModal();
    handleFetchSiteData(values);
    console.log(values, "values");
    setFormValues(values);
  };
  const superiorRole = localStorage.getItem("superiorRole");
  const role = localStorage.getItem("role");
  const ResetForm = () => {
    FetchTableData(currentPage);
    setFormValues();
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> DRS Api Logs</h1>

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
                DRS Api Logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            minHeight={"90px"}
            className="center-filter-modal-responsive"
          >
            {localStorage.getItem("superiorRole") === "Client" &&
            localStorage.getItem("role") === "Operator" ? (
              ""
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"baseline"}
                my={"20px"}
                gap={"5px"}
                mx={"10px"}
                flexDirection={"inherit"}
                className="filter-responsive"
              >
                <span
                  className="Search-data"
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {Object.entries(formValues || {}).some(
                    ([key, value]) =>
                      [
                        "client_name",
                        "Drs Date",
                        "company_name",
                        "site_name",
                        "start_date",
                      ].includes(key) &&
                      value != null &&
                      value !== ""
                  ) ? (
                    Object.entries(formValues || {}).map(([key, value]) => {
                      if (
                        [
                          "client_name",
                          "start_date",
                          "company_name",
                          "site_name",
                          "fromdate",
                        ].includes(key) &&
                        value != null &&
                        value !== ""
                      ) {
                        const formattedKey = key
                          .toLowerCase()
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        return (
                          <div key={key} className="badge">
                            <span className="badge-key">{formattedKey}:</span>
                            <span className="badge-value">{value}</span>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : superiorRole === "Client" && role !== "Client" ? (
                    <div className="badge">
                      <span className="badge-key">Company Name:</span>
                      <span className="badge-value">
                        {localStorage.getItem("PresetCompanyName")}
                      </span>
                    </div>
                  ) : null}
                </span>
                <Box display={"flex"} ml={"4px"} alignSelf={"center"}>
                  <button className="btn btn-primary ml-2" onClick={openModal}>
                    Filter
                    <span className="ms-2">
                      <SortIcon />
                    </span>
                  </button>

                  <WorkflowExceptionFilter
                    title="Filter DRS Api Logs"
                    visible={isModalVisible}
                    onClose={closeModal}
                    onformSubmit={handleFormSubmit}
                    searchListstatus={false}
                  />

                  {Object.keys(formValues || {}).length > 0 ? (
                    <Button
                      onClick={() => {
                        ResetForm();
                      }}
                      className="btn btn-danger ms-2"
                      variant="danger"
                    >
                      Reset <RestartAltIcon />
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> DRS Api Logs</h3>
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
                          // pagination
                          // paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
                          onChangePage={(newPage) => setCurrentPage(newPage)}
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
      </>
    </>
  );
};
export default withApi(ManageEmail);
