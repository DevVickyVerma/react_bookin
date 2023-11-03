import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const FuelDelivery = (props) => {
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
        const response = await axiosInstance.get(
          `/fuel-delivery/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setis_editable(data?.data ? data.data : {});

          // Create an array of form values based on the response data
          const formValues = data?.data?.listing
            ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  opening: item.opening,
                  bunkd_delivery_volume: item.bunkd_delivery_volume,
                  delivery_volume: item.delivery_volume,
                  dips_stock: item.dips_stock,
                  sales_volume: item.sales_volume,
                  book_stock: item.book_stock,
                  variance: item.variance,
                  percentage_sales: item.percentage_sales,
                  variance_lt: item.variance_lt,
                  variance_per: item.variance_per,
                  // Add other properties as needed
                };
              })
            : [];

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        opening,
        bunkd_delivery_volume,
        delivery_volume,
        dips_stock,
        sales_volume,
        book_stock,
        variance,
        variance_lt,
        variance_per,
        percentage_sales,
      } = obj;
      const openingKey = `opening[${id}]`;
      const discountKey = `bunkd_delivery_volume[${id}]`;
      const nettValueKey = `delivery_volume[${id}]`;
      const salesValueKey = `dips_stock[${id}]`;
      const actionKey = `sales_volume[${id}]`;
      const bookStockKey = `book_stock[${id}]`;
      const varianceKey = `variance[${id}]`;
      const varianceLtKey = `variance_lt[${id}]`;
      const variancePerKey = `variance_per[${id}]`;
      const percentage_salesKey = `percentage_sales[${id}]`;

      formData.append(openingKey, opening);
      formData.append(discountKey, bunkd_delivery_volume);
      formData.append(nettValueKey, delivery_volume);
      formData.append(salesValueKey, dips_stock);
      formData.append(actionKey, sales_volume);
      formData.append(bookStockKey, book_stock);
      formData.append(varianceKey, variance);
      formData.append(varianceLtKey, variance_lt);
      formData.append(variancePerKey, variance_per);
      formData.append(percentage_salesKey, percentage_sales);
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/fuel-delivery/update`,
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
        SuccessToast(responseData.message);
        handleButtonClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  const columns = [
    // ... existing columns

    {
      name: "TANK-FUEL",
      selector: (row) => row.fuel_name,
      sortable: false,
      width: "15%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.fuel_name !== undefined
            ? `${row.tank_name}-${row.fuel_name}`
            : ""}
        </span>
      ),
    },

    {
      name: "OPENING",
      selector: (row) => row.opening,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`opening-${index}`}
            name={`data[${index}].opening`}
            className={
              row.update_opening
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.opening}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "BUNKER DELIVERIES",
      selector: (row) => row.bunkd_delivery_volume,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`bunkd_delivery_volume-${index}`}
            name={`data[${index}].bunkd_delivery_volume`}
            className={
              row.update_bunkd_delivery_volume
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.bunkd_delivery_volume}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "DELIVERIES",
      selector: (row) => row.delivery_volume,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`delivery_volume-${index}`}
            name={`data[${index}].delivery_volume`}
            className={
              row.update_delivery_volume
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.delivery_volume}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "DIPS STOCK",
      selector: (row) => row.dips_stock,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`dips_stock-${index}`}
            name={`data[${index}].dips_stock`}
            className={
              row.update_dips_stock
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.dips_stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "SALES",
      selector: (row) => row.sales_volume,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`sales_volume-${index}`}
            name={`data[${index}].sales_volume`}
            className={
              row.update_sales_volume
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.sales_volume}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "BOOKED STOCK",
      selector: (row) => row.book_stock,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`book_stock-${index}`}
            name={`data[${index}].book_stock`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.book_stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (L)",
      selector: (row) => row.variance,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance-${index}`}
            name={`data[${index}].variance`}
            className={
              row.update_variance
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input "
                : "table-input readonly "
            }
            value={formik.values.data[index]?.variance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (%)",
      selector: (row) => row.percentage_sales,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`percentage_sales-${index}`}
            name={`data[${index}].percentage_sales`}
            className={
              row.update_gross_value
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.percentage_sales}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (L) 30 DAYS",
      selector: (row) => row.variance_lt,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance_lt-${index}`}
            name={`data[${index}].variance_lt`}
            className={
              row.update_gross_value
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.variance_lt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (%) 30 DAYS",
      selector: (row) => row.variance_per,
      sortable: false,
      width: "8.5%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance_per-${index}`}
            name={`data[${index}].variance_per`}
            className={
              row.update_gross_value
                ? "UpdateValueInput"
                : editable?.is_editable
                ? "table-input"
                : "table-input readonly"
            }
            value={formik.values.data[index]?.variance_per}
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Delivery</h3>
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

export default FuelDelivery;
