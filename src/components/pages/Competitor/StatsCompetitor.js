import React from 'react'
import Loaderimg from '../../../Utils/Loader'
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorMessage, Field, Formik, useFormik } from 'formik'
import * as Yup from "yup";
import withApi from '../../../Utils/ApiHelper'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import DataTableExtensions from "react-data-table-component-extensions";

const StatsCompetitor = ({ isLoading, getData }) => {
    const [data, setData] = useState();
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
        localStorage.getItem("superiorId")
    );

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [AddSiteData, setAddSiteData] = useState([]);
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [selectedSiteList, setSelectedSiteList] = useState([]);
    const [commonListLoading, setCommonListLoading] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [ClientList, setClientList] = useState([]);
    const [CompanyList, setCompanyList] = useState([]);
    const [SiteList, setSiteList] = useState([]);


    const UserPermissions = useSelector((state) => state?.data?.data);

    useEffect(() => {
        setclientIDLocalStorage(localStorage.getItem("superiorId"));
        if (UserPermissions) {
            setPermissionsArray(UserPermissions.permissions);
        }
    }, [UserPermissions]);
    useEffect(() => {
        handleClientStats();
    }, []);




    const handleClientStats = async () => {
        setCommonListLoading(true);
        try {
            const response = await getData(
                `/client/sites`
            );


            const { data } = response;
            if (data) {
                setData(data?.data);
                setCommonListLoading(false);
            }
            setCommonListLoading(false);
        } catch (error) {
            console.error("API error:", error);
        } // Set the submission state to false after the API call is completed
        setCommonListLoading(false);
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
            name: "Site Name",
            selector: (row) => [row?.site_name],
            sortable: false,
            width: "85%",
            cell: (row, index) => (
                <Link to={`/sitecompetitor/${row.id}`}
                    className="d-flex"
                    style={{ cursor: "pointer" }}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-flex align-items-center">
                        <span>
                            <img
                                src={row?.supplierImage}
                                alt="supplierImage"
                                className="w-5 h-5 "
                            />
                        </span>
                        <h6 className="mb-0 fs-14 fw-semibold ms-2"> {row?.site_name}</h6>
                    </div>
                </Link>

            ),
        },
    ];

    const tableDatas = {
        columns,
        data,
    };

    const role = localStorage.getItem("role");

    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
        },
        validationSchema: Yup.object({
            company_id: Yup.string().required("Company is required"),
        }),

        onSubmit: (values) => {
            // handleSubmit(values);
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
                    setData(response?.data?.data);
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
            {isLoading || commonListLoading ? <Loaderimg /> : null}
            <div className="page-header d-flex">
                <div>
                    <h1 className="page-title ">Competitor Stats</h1>
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
                            Competitor Stats
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="ms-auto ">
                    <div className="input-group">

                    </div>
                </div>
            </div>

            {role === "Administrator" ? <>
                <>
                    <Row>
                        <Col md={12} xl={12}>
                            <Card>
                                <Card.Header>
                                    <h3 className="card-title"> Filter Data</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col lg={6} md={6}>
                                            <div className="form-group">
                                                <label
                                                    htmlFor="client_id"
                                                    className="form-label mt-4"
                                                >
                                                    Client
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.client_id &&
                                                        formik.touched.client_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="client_id"
                                                    name="client_id"
                                                    value={formik.values.client_id}
                                                    onChange={(e) => {
                                                        const selectedType = e.target.value;

                                                        if (selectedType) {
                                                            GetCompanyList(selectedType);
                                                            formik.setFieldValue("client_id", selectedType);
                                                            setSelectedClientId(selectedType);
                                                            setSiteList([]);
                                                            formik.setFieldValue("company_id", "");
                                                            formik.setFieldValue("site_id", "");
                                                        } else {
                                                            console.log(
                                                                selectedType,
                                                                "selectedType no values"
                                                            );
                                                            formik.setFieldValue("client_id", "");
                                                            formik.setFieldValue("company_id", "");
                                                            formik.setFieldValue("site_id", "");

                                                            setSiteList([]);
                                                            setCompanyList([]);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select a Client</option>
                                                    {ClientList.data && ClientList.data.length > 0 ? (
                                                        ClientList.data.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.client_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Client</option>
                                                    )}
                                                </select>

                                                {formik.errors.client_id &&
                                                    formik.touched.client_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.client_id}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>


                                        <Col Col lg={6} md={6}>
                                            <div className="form-group">
                                                <label htmlFor="company_id" className="form-label mt-4">
                                                    Company
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.company_id &&
                                                        formik.touched.company_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="company_id"
                                                    name="company_id"
                                                    value={formik.values.company_id}
                                                    onChange={(e) => {
                                                        const selectcompany = e.target.value;

                                                        if (selectcompany) {
                                                            GetSiteList(selectcompany);
                                                            formik.setFieldValue("company_id", selectcompany);
                                                            formik.setFieldValue("site_id", "");
                                                            setSelectedCompanyId(selectcompany);
                                                        } else {
                                                            formik.setFieldValue("company_id", "");
                                                            formik.setFieldValue("site_id", "");

                                                            setSiteList([]);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select a Company</option>
                                                    {selectedClientId && CompanyList.length > 0 ? (
                                                        <>
                                                            setSelectedCompanyId([])
                                                            {CompanyList.map((company) => (
                                                                <option key={company.id} value={company.id}>
                                                                    {company.company_name}
                                                                </option>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <option disabled>No Company</option>
                                                    )}
                                                </select>
                                                {formik.errors.company_id &&
                                                    formik.touched.company_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.company_id}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </></> : ""}


            <Card>
                <Card.Body>
                    {data?.length > 0 ? (
                        <>
                            <div
                                className="table-responsive deleted-table"
                            >
                                <DataTableExtensions {...tableDatas}>
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        noHeader
                                        defaultSortField="id"
                                        defaultSortAsc={false}
                                        striped={true}
                                        persistTableHead
                                        pagination
                                        paginationPerPage={20}
                                        highlightOnHover
                                        searchable={true}
                                    //   onChangePage={(newPage) => setCurrentPage(newPage)}
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
        </>
    )
}

export default withApi(StatsCompetitor);