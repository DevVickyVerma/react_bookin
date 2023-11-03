import React, { useEffect, useState } from "react";

import { Col, Row, Card, Breadcrumb } from "react-bootstrap";

import * as Yup from "yup";

import { Link, useParams } from "react-router-dom";

import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";

const AddCompany = (props) => {
  const { isLoading, getData, postData } = props;
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  const [selectedSiteList1, setSelectedSiteList1] = useState([]);
  const { id } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [ReportsData, setReportsData] = useState([]);

  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/addon/assigned?id=${id}`);

      if (response && response.data) {
        setReportsData(response?.data?.data);

        formik.setFieldValue("FormikreportsData", response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  const ReportsColumn = [
    {
      name: "Select",
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikreportsData[${index}].checked`}
            className="table-input"
            checked={
              formik.values?.FormikreportsData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Addon",
      selector: (row) => row.name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
  ];

  const handleSubmit = async (event, values) => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("id", id);
      const selectedReportsIds = [];
      const reports_models_valueKey = "addons";

      for (let i = 0; i < formik.values.FormikreportsData.length; i++) {
        const { id, checked } = formik.values.FormikreportsData[i];

        if (checked) {
          const reportIdKey = `${reports_models_valueKey}[${i}]`;
          const reportIdValue = id;
          const reportIdEntry = { [reportIdKey]: reportIdValue };
          selectedReportsIds.push(reportIdEntry);
        }
      }

      selectedReportsIds.forEach((reportIdEntry) => {
        const key = Object.keys(reportIdEntry)[0];
        const value = reportIdEntry[key];
        formData.append(key, value);
      });

      const postDataUrl = "/addon/assign";
      const navigatePath = `/clients`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) { }
  };

  const formik = useFormik({
    initialValues: {
      userSelectedid: "",
    },
    validationSchema: Yup.object({
      userSelectedid: Yup.string().max(20, "Must be 20 characters or less"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Assign Addon</h1>

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
                  Assign Addon
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Assign Addon</Card.Title>
                </Card.Header>

                <form onSubmit={(event) => formik.handleSubmit(event)}>
                  <Card.Body>
                    <Row>
                      <Col lg={12} md={12}>
                        <Card.Header className="cardheader-table">
                          <h3 className="card-title"> Addons</h3>
                        </Card.Header>

                        {ReportsData?.length > 0 ? (
                          <>
                            <div className="module-height-Addon">
                              <DataTable
                                columns={ReportsColumn}
                                data={ReportsData}
                                noHeader
                                defaultSortField="id"
                                defaultSortAsc={false}
                                striped={true}
                                persistTableHead
                                highlightOnHover
                                searchable={false}
                                responsive
                              />
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
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
