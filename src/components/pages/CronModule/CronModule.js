import React from "react";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";

const CronModule = ({ getData, isLoading, postData }) => {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [cronList, setCronList] = useState();
  const [selectedCronList, setSelectedCronList] = useState();
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  const isLogsPermissionAvailable = permissionsArray?.includes("cronjob-logs");

  const isHitPermissionAvailable = permissionsArray?.includes("cronjob-hit");

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions, permissionsArray]);

  useEffect(() => {
    FetchCronListApi();
  }, []);

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
      name: "user",
      selector: (row) => [row?.user],
      sortable: false,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.user}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Hit Type",
      selector: (row) => [row?.type],
      sortable: false,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => [row?.date],
      sortable: false,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.date}</h6>
          </div>
        </div>
      ),
    },
  ];

  const FetchCronListApi = async (pageNumber) => {
    try {
      const response = await getData(`/cron-job/list`);
      setCronList(response?.data?.data?.cronJobs);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const tableDatas = {
    columns,
    data,
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const animatedComponents = makeAnimated();
  const Optionssingle = cronList?.map((item) => ({
    value: item?.id,
    label: item?.title,
    url: item?.url,
    status: item?.status,
  }));

  const fetchCronJobApi = async () => {
    try {
      const response = await getData(
        `/cron-job/logs?cron_job_id=${selectedCronList?.value}`
      );
      setData(response?.data?.data?.cronLogs);
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

  const FetchHiddenCronList = async () => {
    try {
      const response = await getData(`${selectedCronList.url}`);
      if (response) {
        SuccessAlert(response?.data?.message);

      }
    } catch (error) {
      ErrorAlert(error);
    }

    const postDataUrl = `/cron-job/create?cron_job_id=${selectedCronList?.value}`;
    await postData(postDataUrl); // Set the submission state to false after the API call is completed

    await fetchCronJobApi()
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header d-flex flex-wrap">
        <div>
          <h1 className="page-title ">Cron Module </h1>
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
              Cron Module
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="ms-auto "></div>
      </div>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Manage Cron</h3>
            </Card.Header>
            <Card.Body>
              <div className="ms-auto">
                <label>Filter Cron Site:</label>
                <div style={{ minWidth: "200px" }}>
                  <Select
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={Optionssingle}
                    onChange={(value) => setSelectedCronList(value)}
                    className="test"
                  />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="text-end">
                {isLogsPermissionAvailable ? (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                      disabled={!selectedCronList}
                      onClick={fetchCronJobApi}
                    >
                      Show Logs
                    </button>
                  </>
                ) : (
                  ""
                )}

                {isHitPermissionAvailable ? (
                  <>
                    {selectedCronList ? (
                      <button
                        type="submit"
                        className="btn btn-danger me-2"
                        // to={selectedCronList.url}
                        onClick={FetchHiddenCronList}
                        style={{ color: "white" }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button className="btn btn-danger me-2" disabled>
                        Submit
                      </button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> Cron Module Logs</h3>
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
  );
};

export default CronModule;
