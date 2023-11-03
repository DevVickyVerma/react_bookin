import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Modal,
  Button,
  Pagination,
} from "react-bootstrap";
import Loaderimg from "../../Utils/Loader";
import withApi from "../../Utils/ApiHelper";

const Notification = (props) => {
  const { isLoading, getData } = props;

  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [Modalmessage, setModalmessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchData(currentPage);
    console.clear();
  }, [currentPage]);

  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(`/notifications?page=${pageNumber}`);

      if (response.data.api_response === "success") {
        setData(response?.data?.data?.notifications);

        setCount(response?.data?.data?.count);
        setCurrentPage(response?.data?.data?.currentPage);
        setHasMorePages(response?.data?.data?.hasMorePages);

        setLastPage(response?.data?.data?.lastPage);
        setPerPage(response?.data?.data?.perPage);
        setTotal(response?.data?.data?.total);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleRowExpandToggle = (row) => {
    const isRowExpanded = expandedRows.includes(row.id);

    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((id) => id !== row.id));
    } else {
      setModalContent(row.response);
      setModalmessage(row.message);
      setIsModalOpen(true);
      setExpandedRows([...expandedRows, row.id]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpandedRows([]); // Reset the button text to "Show Response" when the modal is closed
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
      name: "Notification",
      selector: (row) => [row.message],
      sortable: true,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => handleRowExpandToggle(row)}
              className="mb-0 fs-14 fw-semibold"
            >
              {row.message}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Date",
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
      name: "Time",
      selector: (row) => [row.ago],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.ago}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.response],
      sortable: true,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex messagebox">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {expandedRows.includes(row.id) ? (
                <>
                  <button
                    className="btn  btn-danger "
                    type="button"
                    onClick={() => handleRowExpandToggle(row)}
                  >
                    {expandedRows.includes(row.id)
                      ? "Hide Response"
                      : "Show Response"}
                  </button>
                </>
              ) : (
                <button
                  className="btn  btn-primary "
                  type="button"
                  onClick={() => handleRowExpandToggle(row)}
                >
                  Show Response
                </button>
              )}
            </h6>
          </div>
        </div>
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

  // Add ellipsis if there are more pages before or after the displayed range
  if (startPage > 1) {
    pages.unshift(<Pagination.Ellipsis key="ellipsis-start" disabled />);
  }

  if (endPage < lastPage) {
    pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
  }

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
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
              Notification
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Notifications</h3>
            </Card.Header>
            <Card.Body>
              {data?.length > 0 ? (
                <>
                  <div className="table-responsive deleted-table">
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        // pagination
                        highlightOnHover
                        searchable={false}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={require("../../assets/images/noDataFoundImage/noDataFound.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}

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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>{Modalmessage}</Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: modalContent }} />
        <Modal.Footer>
          <Button
            className="btn  btn-danger"
            variant="secondary"
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withApi(Notification);
