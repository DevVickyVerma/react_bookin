import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreditCardBanking = (props) => {
  const {
    apidata,
    error,
    company_id,
    client_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;

  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
    };

    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [Apidata, setApiData] = useState([]);
  const [editable, setis_editable] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        setIsLoading(true); // Set loading state to true before fetching data

        const response = await axiosInstance.get(
          `/card-banking/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data.data.listing);
          setis_editable(data.data);

          //   {
          //     "id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
          //     "site_id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
          //     "card_id": "cDd2VGlMRzRYUE5vdEFLcEJpZVY1Zz09",
          //     "card_name": "Visa Delta",
          //     "koisk_value": "5496.85000",
          //     "opt_value": 0,
          //     "account_value": 0,
          //     "no_of_transactions": 0,
          //     "created_date": null,
          //     "updated_date": null,
          //     "update_koisk_value": false,
          //     "update_opt_value": false,
          //     "update_account_value": false,
          //     "update_no_of_transactions": false
          // }

          // Create an array of form values based on the response data
          const formValues = data.data.listing.map((item) => {
            return {
              id: item.id,
              card_name: item.card_name,
              koisk_value: item.koisk_value,
              opt_value: item.opt_value,
              account_value: item.account_value,
              no_of_transactions: item.no_of_transactions,
            };
          });

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after data fetching is complete
      }
    };

    if (start_date) {
      fetchData();
    }
  }, [site_id, start_date]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    values.data.forEach((obj) => {
      const id = obj.id;
      const grossValueKey = `opt_value[${id}]`;
      const account_valueKey = `account_value[${id}]`;
      const nettValueKey = `no_of_transactions[${id}]`;
      const koisk_value = `koisk_value[${id}]`;
      // const actionKey = `action[${id}]`;

      const grossValue = obj.opt_value;
      const account_value = obj.account_value;
      const nettValue = obj.no_of_transactions;
      const salesValue = obj.koisk_value;
      // const action = obj.action;

      formData.append(grossValueKey, grossValue);
      formData.append(account_valueKey, account_value);
      formData.append(nettValueKey, nettValue);
      formData.append(koisk_value, salesValue);
    });

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/card-banking/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json(); // Read the response once

      if (response.ok) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        SuccessToast(responseData.message);
        handleButtonClick();
      } else {
        ErrorToast(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    // ... existing columns

    {
      name: "Card Name",
      selector: (row) => row.card_name,
      sortable: false,
      width: "20%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.card_name !== undefined ? `${row.card_name}` : ""}
        </span>
      ),
    },
    {
      name: "KOISK VALUE",
      selector: (row) => row.koisk_value,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.koisk_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`koisk_value-${index}`}
              name={`data[${index}].koisk_value`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.koisk_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "OPT VALUE",

      selector: (row) => row.opt_value,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.opt_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`opt_value-${index}`}
              name={`data[${index}].opt_value`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.opt_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ACCOUNT VALUE	",
      selector: (row) => row.account_value,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.account_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`account_value-${index}`}
              name={`data[${index}].account_value`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.account_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "NO. OF TRANSACTIONS",
      selector: (row) => row.no_of_transactions,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.no_of_transactions}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`no_of_transactions-${index}`}
              name={`data[${index}].no_of_transactions`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.no_of_transactions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];

  const tableDatas = {
    columns,
    data,
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Credit Card Banking</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
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
                            highlightOnHover
                            searchable={false}
                          />
                        </DataTableExtensions>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        {editable?.is_editable ? (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            type="submit"
                            disabled
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </form>
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

export default CreditCardBanking;
