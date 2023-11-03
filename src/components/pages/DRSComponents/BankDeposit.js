import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { BsCurrencyPound, BsDownload } from "react-icons/bs";
import { BiSolidFilePdf } from "react-icons/bi";

import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const BankDeposit = (props) => {
  const {
    apidata,
    isLoading,
    error,
    getData,
    postData,
    SiteID,
    ReportDate,
    client_id,
    company_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [Editdata, setEditData] = useState(false);
  const [bankAmount, setBankAmount] = useState();
  const [checkStateForBankDeposit, setCheckStateForBankDeposit] =
    useState(true);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);

  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
      checkStateForBankDeposit,
    };
    sendDataToParent(allPropsData);
  };

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
        const formData = new FormData();
        formData.append("id", id);
        DeleteClient(formData);
      }
    });
  };
  const DeleteClient = async (formData) => {
    try {
      const response = await postData("drs/bank-deposite/delete", formData);

      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
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

  useEffect(() => {
    FetchTableData();
    console.clear();
  }, []);
  const [editable, setis_editable] = useState();
  const FetchTableData = async () => {
    try {
      const response = await getData(
        `/drs/bank-deposite/?site_id=${SiteID}&drs_date=${ReportDate}`
      );

      if (response && response.data && response.data.data) {
        setBankAmount(response?.data?.data?.amount);
        setData(
          response?.data?.data?.listing ? response?.data.data.listing : []
        );
        // setData(data?.data?.listing ? data.data.listing : []);
        setis_editable(response?.data?.data);
        setSearchvalue(response.data.data.cards);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required("Amount is required")
      .test("is-number", "Invalid Amount. Please enter a number", (amount) =>
        /^-?\d*\.?\d+$/.test(amount)
      ),
    reason: Yup.string().required("Reason is required"),
  });
  const handleSubmit = async (values, setSubmitting) => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      formData.append("reason", values.reason);
      formData.append("amount", values.amount);
      formData.append("slip", values.image);

      formData.append("site_id", SiteID);
      formData.append("drs_date", ReportDate);
      if (Editdata) {
        formData.append("id", values.id);
      }

      const postDataUrl = Editdata
        ? "/drs/bank-deposite/update"
        : "/drs/bank-deposite/add";

      const response = await postData(postDataUrl, formData);

      if (apidata.api_response === "success") {
        setEditData(false);
        FetchTableData();
        handleButtonClick();
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      // Set the submission state to false if an error occurs
    }
  };

  const handleEdit = (item) => {
    formik.setValues(item);
    setEditData(true);
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      reason: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      handleSubmit(values);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
  };

  const previewImage = formik.values.image
    ? URL.createObjectURL(formik.values.image)
    : null;

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
      name: "Amount",
      selector: (row) => [row.amount],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.amount}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Reason",
      selector: (row) => [row.reason],
      sortable: true,
      width: "10%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.reason}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "slip",
      selector: (row) => [row.slip],
      sortable: true,
      width: "20%",

      cell: (row, index) => (
        <div className="d-flex align-items-center card-img">
          { }

          <div style={{ cursor: "pointer" }}>
            {row.slip_type === "pdf" ? (
              <>
                <a
                  href={row?.slip}
                  target="_blank"
                  download="my-pdf-filename.pdf"
                  rel="noreferrer"
                >
                  <BsDownload size={24} />
                </a>
              </>
            ) : (
              <a
                href={row?.slip}
                target="_blank"
                download={row?.slip}
                className="mr-2"
                rel="noreferrer"
              >
                <img
                  src={row.slip}
                  alt={row.slip}
                  style={{ width: "50px", height: "50px" }}
                />
              </a>
            )}
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {editable?.is_editable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
                onClick={() => handleEdit(row)}
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
          {editable?.is_editable ? (
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
  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();
  const [isDragging, setIsDragging] = useState(false);
  // const [previewImage, setPreviewImage] = useState(null);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        {" "}
        {editable?.is_editable ? (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title"> Bank Deposit</h3>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} xl={6} md={6} sm={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="amount">
                            Amount<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.amount && formik.touched.amount
                              ? "is-invalid"
                              : ""
                              }`}
                            id="amount"
                            name="amount"
                            placeholder="Amount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                          />
                          {formik.errors.amount && formik.touched.amount && (
                            <div className="invalid-feedback">
                              {formik.errors.amount}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="reason">
                            Choose Reason<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.reason && formik.touched.reason
                              ? "is-invalid"
                              : ""
                              }`}
                            id="reason"
                            name="reason"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.reason}
                          >
                            <option value="">---Select Any---</option>
                            <option value="0">
                              Loomis didn't come for collection
                            </option>
                            <option value="1">
                              Site operator missed the Loomis
                            </option>
                            <option value="2">Completely updated</option>
                          </select>
                          {formik.errors.reason && formik.touched.reason && (
                            <div className="invalid-feedback">
                              {formik.errors.reason}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label htmlFor="image">Image</label>
                          <div
                            className={`dropzone ${formik.errors.image && formik.touched.image
                              ? "is-invalid"
                              : ""
                              }`}
                            onDrop={(event) => handleDrop(event)}
                            onDragOver={(event) => event.preventDefault()}
                          >
                            <input
                              type="file"
                              id="image"
                              name="image"
                              onChange={(event) => handleImageChange(event)}
                              className="form-control"
                            />
                            <p>
                              Drag and drop your image here, or click to browse
                            </p>
                          </div>
                          {formik.errors.image && formik.touched.image && (
                            <div className="invalid-feedback">
                              {formik.errors.image}
                            </div>
                          )}
                        </div>
                      </Col>
                      <div className="text-end">
                        {Editdata ? (
                          <button type="submit" className="btn btn-primary">
                            Update
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-primary">
                            Add
                          </button>
                        )}
                      </div>
                    </Row>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header style={{ gap: "70px" }}>
                <h3 className="card-title">Bank Deposit</h3>
                {bankAmount ? (
                  <h3
                    style={{
                      textAlign: "left",
                      margin: " 13px 0",
                      fontSize: "15px",
                      color: "white",
                      background: "#b52d2d",
                      padding: "10px",
                      borderRadius: "7px",
                    }}
                  >
                    Amount need to be deposit:
                    £{bankAmount}
                  </h3>
                ) : (
                  ""
                )}
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
export default withApi(BankDeposit);
