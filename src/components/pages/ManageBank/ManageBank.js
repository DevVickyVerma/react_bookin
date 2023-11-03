import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ErrorAlert } from '../../../Utils/ToastUtils';

const ManageBank = ({ isLoading, getData }) => {
    const [data, setData] = useState();
    const [permissionsArray, setPermissionsArray] = useState([]);
    const UserPermissions = useSelector((state) => state?.data?.data);
    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions.permissions);
        }
    }, [UserPermissions]);
    useEffect(() => {
        fetchBankManagerList();
    }, []);
    const isAddPermissionAvailable = permissionsArray?.includes("bankmanager-create");
    const isDeletePermissionAvailable = permissionsArray?.includes(
        "bankmanager-delete"
    );
    const isEditPermissionAvailable = permissionsArray?.includes(
        "bankmanager-edit"
    );
    const { id } = useParams();

    const navigate = useNavigate();
    // const ErrorAlert = (message) => toast.error(message);


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
                            "site/bank-manager/delete",
                            formData
                        );
                        setData(response.data.data);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your item has been deleted.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        fetchBankManagerList();
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

    const fetchBankManagerList = async () => {
        try {
            const response = await getData(`/site/bank-manager/list?site_id=${id}`);
            if (response && response.data) {
                setData(response?.data?.data?.managers);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }

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
            name: "Manager Name",
            selector: (row) => [row.manager_name],
            sortable: true,
            width: "12.8%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.manager_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Bank Name",
            selector: (row) => [row.bank_name],
            sortable: false,
            width: "12.8%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.bank_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Account Name",
            selector: (row) => [row.account_name],
            sortable: true,
            width: "12.8%",
            cell: (row, index) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.account_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Account No.",
            selector: (row) => [row.account_no],
            sortable: true,
            width: "12.8%",
            cell: (row, index) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.account_no}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Sort Code",
            selector: (row) => [row.sort_code],
            sortable: false,
            width: "12.8%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.sort_code}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Created Date",
            selector: (row) => [row.created_date],
            sortable: false,
            width: "12.8%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Action",
            selector: (row) => [row.action],
            sortable: false,
            width: "12.8%",
            cell: (row) => (
                <span className="text-center">
                    {isEditPermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link
                                to={`/editbankmanager/${row.id}`}
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

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header d-flex">
                    <div>
                        <h1 className="page-title">Bank Manager </h1>
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
                                Bank Manager
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="ms-auto pageheader-btn">
                        <div className="input-group">
                            {isAddPermissionAvailable ? (
                                <Link
                                    to={`/addbank/${id}`}
                                    className="btn btn-primary ms-2"
                                    style={{ borderRadius: "4px" }}
                                >
                                    Add Bank Manager
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
                                <h3 className="card-title">Bank Manager </h3>
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
                                                    pagination
                                                    paginationPerPage={20}
                                                    highlightOnHover
                                                    searchable={true}
                                                    fixedHeader
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


            </div>


        </>
    )
}

export default withApi(ManageBank);