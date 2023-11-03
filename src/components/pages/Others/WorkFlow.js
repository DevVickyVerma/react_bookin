import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import CustomClient from "../../../Utils/CustomClient";
import CustomCompany from "../../../Utils/CustomCompany";

const ManageSite = (props) => {
  const { isLoading, getData, } = props;

  const [data, setData] = useState();
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);



  const handleSubmit1 = async (values) => {
    try {
      try {
        let clientIDCondition = "";
        if (localStorage.getItem("superiorRole") !== "Client") {
          clientIDCondition = `client_id=${values.client_id}&`;
        } else {
          clientIDCondition = `client_id=${clientIDLocalStorage}&`;
        }

        const response = await getData(
          `/workflow/?${clientIDCondition}company_id=${values.company_id}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data);
        }
      } catch (error) {
        console.error("API error:", error);
      } // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const PerformAction = (row) => {
    const dataToSend = {
      client_id: row.client_id,
      company_id: row.company_id,
      start_date: row.drs_date,
      site_id: row.id,
    };


    localStorage.setItem("dailyWorkFlowInput", JSON.stringify(dataToSend));

    // Encode the data and create the query parameter string
    const queryParam = encodeURIComponent(JSON.stringify(dataToSend));

    // Construct the link URL with the encoded query parameter
    // const linkUrl = `/data-entry?data=${queryParam}`;
    const linkUrl = `/data-entry`;

    // Navigate to the desired route
    window.location.href = linkUrl;
  };
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "15%",
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
      width: "40%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.site_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "WorkFlow",
      selector: (row) => [row.work_flow],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            {row.work_flow === "Not Done" ? (
              <>
                <h6
                  style={{
                    cursor: "pointer",
                  }}
                  className="mb-0 fs-14 fw-semibold badge bg-danger"
                  onClick={() => PerformAction(row)}
                >
                  {row.work_flow}
                </h6>
              </>
            ) : row.work_flow === "Done" ? (
              <h6 className="mb-0 fs-14 fw-semibold work-flow-sucess-status">
                {row.work_flow}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },

    {
      name: " Approval Required",
      selector: (row) => [row.approval],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            {row.approval === "No" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-success  ">
                {row.approval}
              </h6>
            ) : row.approval === "Yes" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-danger  ">
                {row.approval}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };


  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),

    onSubmit: (values) => {
      handleSubmit1(values);
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

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
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

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Workflow Status</h1>

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
                Workflow Status
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter Data</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>



                    <CustomClient
                      formik={formik}
                      lg={6}
                      md={6}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={6}
                      md={6}
                      CompanyList={CompanyList}
                      setSelectedCompanyId={setSelectedCompanyId}
                      setSiteList={setSiteList}
                      selectedClientId={selectedClientId}
                      GetSiteList={GetSiteList}
                    />


                  </Row>

                  <Card.Footer className="text-end">
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Workflow Status</h3>
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
                          paginationPerPage={20}
                          highlightOnHover
                          searchable={false}
                          responsive={true}
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
