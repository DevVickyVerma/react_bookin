import { Card, Col, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";

const DashSubChildShopSaleCenterModal = (props) => {
  const { showModal, setShowModal, shopPerformanceData } = props;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderTableHeader = () => {
    return (
      <tr className="fuelprice-tr" style={{ padding: "0px" }}>
        <th
          className="dashboard-shopSale-table-width dashboard-shopSale-table-th"
          style={{ paddingLeft: "25px" }}
        >
          Name
        </th>
        <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
          Shop Sales
        </th>
        <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
          Quantity
        </th>
        <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
          Transactions
        </th>
      </tr>
    );
  };

  const renderTableData = () => {
    return (
      <>
        {shopPerformanceData?.card_details?.map((cardDetail, index) => (
          <tr className="fuelprice-tr " style={{ padding: "0px" }}>
            <td
              className="dashboard-shopSale-table-width dashboard-shopSale-table-td "
              style={{ minWidth: "25%" }}
            >
              <div className="d-flex align-items-center justify-center h-100">
                <div className="d-flex">
                  <div className="ms-2 mt-0 mt-sm-2 d-block">
                    <h6 className="mb-0 fs-15 fw-semibold ">
                      <img
                        src={cardDetail.image}
                        alt={cardDetail.card_name || "Card Image Alt Text"}
                        style={{
                          width: "60px",
                          height: "40px",
                          background: "#FFF",
                          padding: "5px",
                          borderRadius: "8px",
                          margin: "0 5px",
                        }}
                      />
                      {cardDetail?.card_name}
                    </h6>
                  </div>
                </div>
              </div>
            </td>

            <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
              <div className="d-flex align-items-center h-100 ">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold ">
                    {cardDetail?.shop_sales}
                  </h6>
                </div>
              </div>
            </td>

            <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
              <div className="d-flex align-items-center h-100 ">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold ">
                    {cardDetail?.quantity}
                  </h6>
                </div>
              </div>
            </td>

            <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
              <div className="d-flex align-items-center h-100 ">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold ">
                    {cardDetail?.transactions}
                  </h6>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      className="custom-modal-width custom-modal-height"
    >
      <div
        class="modal-header"
        style={{ color: "#fff", background: "#6259ca" }}
      >
        <h5 class="modal-title">{shopPerformanceData?.name}</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span onClick={handleCloseModal} style={{ cursor: "pointer" }}>
            <AiOutlineClose color="#fff" />
          </span>
        </button>
      </div>

      <Modal.Body className="Disable2FA-modal">
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                <Row className=" d-flex justify-content-between m-0">
                  <Col
                    lg={3}
                    xl={3}
                    md={3}
                    sm={3}
                    className="dashboardSubChildCard"
                    borderRadius={"5px"}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 700 }}>
                        {" "}
                        Shop Sales :{shopPerformanceData?.shop_sales}
                      </strong>
                      { }
                    </span>
                  </Col>
                  <Col
                    lg={3}
                    xl={3}
                    md={3}
                    sm={3}
                    className="dashboardSubChildCard "
                    borderRadius={"5px"}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 700 }}>
                        {" "}
                        Quantity :{shopPerformanceData?.quantity}
                      </strong>
                      { }
                    </span>
                  </Col>
                  <Col
                    lg={3}
                    xl={3}
                    md={3}
                    sm={3}
                    className="dashboardSubChildCard "
                    borderRadius={"5px"}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 700 }}>
                        {" "}
                        Transactions :{shopPerformanceData?.transactions}
                      </strong>
                      { }
                    </span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: "-32px" }}>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {shopPerformanceData ? (
                  <div
                    className="table-container table-responsive"
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 300px )",
                      // minHeight: "100px"
                    }}
                  >
                    <table className="table">
                      <thead
                        style={{
                          position: "sticky",
                          top: "0",
                          width: "100%",
                        }}
                      >
                        <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                      </thead>
                      <tbody>{renderTableData()}</tbody>
                    </table>
                  </div>
                ) : (
                  <img
                    src={require("../../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

DashSubChildShopSaleCenterModal.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default DashSubChildShopSaleCenterModal;
