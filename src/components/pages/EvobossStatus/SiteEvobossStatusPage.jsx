import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const SiteEvobossStatusPage = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const storedRowData = localStorage.getItem("evoBossStatusPageId");
    if (storedRowData) {
      setRowData(JSON.parse(storedRowData));
    }
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Site Evoboss Status</h1>

            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/site-evobos-status" }}
              >
                Site Evoboss Status
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                {rowData ? rowData.site_name : `site Evoboss Status Page`}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* Table */}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">
                  {rowData ? rowData.site_name : `site Evoboss Status Page`}
                </h3>
              </Card.Header>

              <Card.Body>
                <div className="table-responsive deleted-table"></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default SiteEvobossStatusPage;
