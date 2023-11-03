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
import moment from "moment/moment";

const FuelInventry = (props) => {
  const { company_id, client_id, site_id, start_date, sendDataToParent } =
    props;

  const [fuelInventoryFinalDataArray, setFuelInventoryFinalDataArray] =
    useState();
  // const [myFuelPriceValue, setMyFuelPriceValue] = useState();
  const [myDueSalesValue, setMyDueSalesValue] = useState();
  const [myBunkeredSalesValue, setMyBunkeredSalesValue] = useState();
  const [myAdjustmentValue, setMyAdjustmentValue] = useState();
  const [myTestsValue, setMyTestsValue] = useState();

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
  const [CombinedVarianceData, setCombinedVarianceData] = useState([]);
  const [VarianceDataa, setVarianceDataa] = useState([]);
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
          `/fuel-inventory/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setCombinedVarianceData(
            data?.data ? data.data.combined_variance_data : []
          );
          setVarianceDataa(data?.data ? data.data.variance_data : []);
          setis_editable(data?.data ? data.data : {});

          const formValues = data?.data?.listing
            ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  fuel_price: item.fuel_price,
                  metered_sale: item.metered_sale,
                  metered_sale_value: item.metered_sale_value,
                  adjustment: item.adjustment,
                  adjustment_euro: item.adjustment_euro,
                  adjusted_sale: item.adjusted_sale,
                  adjusted_sale_value: item.adjusted_sale_value,
                  tests: item.tests,
                  actual_sales: item.actual_sales,
                  due_sales: item.due_sales,
                  bunkered_sale: item.bunkered_sale,
                  // Add other properties as needed
                };
              })
            : [];

          const Combinedvariancedata = data?.data?.combined_variance_data
            ? data.data.combined_variance_data.map((item) => ({
                description: item.description,
                variance: item.variance,
                // Add other properties as needed
              }))
            : [];
          formik.setFieldValue("Combinedvariance", Combinedvariancedata);

          const Variancedata = data?.data?.variance_data
            ? data.data.variance_data.map((item) => ({
                description: item.description,
                variance: item.variance,
                due_sales: item.due_sales,
                sale_value: item.sale_value,
                // Add other properties as needed
              }))
            : [];
          formik.setFieldValue("Variancedataformik", Variancedata);

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
          formik.setFieldValue("data2", formValues);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const handleSubmit = async (values, event) => {
    const token = localStorage.getItem("token");

    if (event.key === "Enter") {
      event.preventDefault();
    }

    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        fuel_price,
        metered_sale,
        metered_sale_value,
        adjustment,
        adjustment_euro,
        adjusted_sale,
        adjusted_sale_value,
        actual_sales,
        due_sales,
        tests,
        bunkered_sale,
      } = obj;
      const fuel_priceKey = `fuel_price[${id}]`;
      const discountKey = `metered_sale[${id}]`;
      const nettValueKey = `metered_sale_value[${id}]`;
      const salesValueKey = `adjustment[${id}]`;
      const actionKey = `adjustment_euro[${id}]`;
      const bookStockKey = `adjusted_sale[${id}]`;
      const adjusted_sale_valueKey = `adjusted_sale_value[${id}]`;
      const adjusted_sale_valueLtKey = `actual_sales[${id}]`;
      const adjusted_sale_valuePerKey = `due_sales[${id}]`;
      const testsKey = `tests[${id}]`;
      const bunkered_saleKey = `bunkered_sale[${id}]`;

      formData.append(fuel_priceKey, fuel_price);
      formData.append(discountKey, metered_sale);
      formData.append(nettValueKey, metered_sale_value);
      formData.append(salesValueKey, adjustment);
      formData.append(actionKey, adjustment_euro);
      formData.append(bookStockKey, adjusted_sale);
      formData.append(adjusted_sale_valueKey, adjusted_sale_value);
      formData.append(adjusted_sale_valueLtKey, actual_sales);
      formData.append(adjusted_sale_valuePerKey, due_sales);
      formData.append(testsKey, tests);
      formData.append(bunkered_saleKey, bunkered_sale);
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/fuel-inventory/update`,
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
        //
        SuccessToast(responseData.message);
        handleButtonClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        ErrorToast(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  function calculateSum(index) {
    const plattsPrice = Number(formik?.values?.data?.[index]?.adjustment);
    const bunkeredsale = Number(formik?.values?.data?.[index]?.bunkered_sale);
    const tests = Number(formik?.values?.data?.[index]?.tests);
    const MeterSale2 = Number(formik?.values?.data2?.[index]?.metered_sale);
    const MeterSale = Number(formik?.values?.data?.[index]?.metered_sale);
    const actualsales = Number(formik?.values?.data?.[index]?.actual_sales);
    const fuelprice = Number(formik?.values?.data?.[index]?.fuel_price);

    if (
      !isNaN(plattsPrice) &&
      !isNaN(bunkeredsale) &&
      !isNaN(tests) &&
      !isNaN(actualsales) &&
      !isNaN(fuelprice) &&
      !isNaN(MeterSale)
    ) {
      const finalTotal = plattsPrice + bunkeredsale + tests;
      const finalAmount = MeterSale2 - finalTotal;
      const finalAmount2 = fuelprice * finalAmount;
      const actualsales = finalAmount.toFixed(2);
      const duesales = finalAmount2.toFixed(2);
      formik.setFieldValue(`data[${index}].actual_sales`, actualsales);
      formik.setFieldValue(`data[${index}].due_sales`, duesales);

      calculateTotalValues(index, duesales);
    } else {
      console.log("Invalid or missing numeric values");
    }
  }

  const calculateTotalValues = async (updatedIndex, UpdatedValue) => {
    const dataArray = formik?.values?.data;

    if (dataArray) {
      // Create a new array with updated values
      const updatedDataArray = dataArray.map((item, index) => {
        if (index === updatedIndex) {
          // Update the value at the specified index
          return { ...item, due_sales: UpdatedValue };
        } else {
          // Keep other items unchanged
          return item;
        }
      });

      await updatedDataArray.pop();

      setFuelInventoryFinalDataArray(updatedDataArray);
    }
  };

  useEffect(() => {
    calculateSumForAll();
  }, [fuelInventoryFinalDataArray]);

  const calculateSumForAll = () => {
    let totalDueSales = 0;
    let totalBunkeredSales = 0;
    let totalAdjustment = 0;
    let totalTests = 0;

    // Iterate through the data array and sum up the values
    if (fuelInventoryFinalDataArray) {
      for (const item of fuelInventoryFinalDataArray) {
        // totalFuelPrice += parseFloat(item.fuel_price);
        totalDueSales += parseFloat(item.due_sales);
        totalBunkeredSales += parseFloat(item.bunkered_sale);
        totalAdjustment += parseFloat(item.adjustment);
        totalTests += parseFloat(item.tests);
      }
    }

    // setMyFuelPriceValue(totalFuelPrice.toFixed(2))
    setMyDueSalesValue(totalDueSales.toFixed(2));
    setMyBunkeredSalesValue(totalBunkeredSales.toFixed(2));
    setMyAdjustmentValue(totalAdjustment.toFixed(2));
    setMyTestsValue(totalTests.toFixed(2));
  };

  function CalculateDueSales(index) {
    const fuelprice = Number(formik?.values?.data?.[index]?.fuel_price);
    const actualsales = Number(formik?.values?.data?.[index]?.actual_sales);

    if (!isNaN(actualsales) && !isNaN(fuelprice)) {
      const finalAmount2 = fuelprice * actualsales;
      const duesales = finalAmount2.toFixed(2);

      formik.setFieldValue(`data[${index}].due_sales`, duesales);

      calculateTotalValues(index, duesales);
    } else {
      console.log("Invalid or missing numeric values");
    }
  }

  const columns = [
    // ... existing columns

    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      sortable: false,
      width: "15%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold ">
          <>
            {row?.description !== undefined ? `${row?.description}` : ""}
            <br></br>
            <span className="margin-top">
              {row?.time_range !== undefined ? (
                <>
                  {row?.time_range?.split(" - ").map((timePart, index) => (
                    <span
                      className="Fuelinvenrtytime_range ms-2 mb-4-"
                      key={index}
                    >
                      {index === 0
                        ? `Start: ${moment(
                            timePart,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("MMM DD, YYYY HH:mm A")}`
                        : `End : ${moment(
                            timePart,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("MMM DD, YYYY HH:mm A")}`}
                      <br />
                    </span>
                  ))}
                </>
              ) : (
                ""
              )}
            </span>
          </>
        </span>
      ),
    },

    {
      name: "PRICE",
      selector: (row) => row.fuel_price,
      sortable: false,
      width: "10.6%",
      center: true,
      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.fuel_price}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`fuel_price-${index}`}
              name={`data[${index}].fuel_price`}
              step="0.010"
              className={`table-input ${
                row?.fuel_price_status === "UP"
                  ? "table-inputGreen"
                  : row?.fuel_price_status === "DOWN"
                  ? "table-inputRed"
                  : ""
              } ${!editable?.is_price_editable ? "readonly" : ""}`}
              value={formik.values.data[index]?.fuel_price}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                CalculateDueSales(index);
                // calculateSumForAll();
              }}
              readOnly={editable?.is_price_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "	CASH METERED SALES VOL.(ℓ)",
      selector: (row) => row.metered_sale,
      sortable: false,
      width: "10.8%",
      center: true,
      // Title: "CASH METERED SALES",

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.metered_sale}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`metered_sale-${index}`}
              name={`data[${index}].metered_sale`}
              className={"table-input readonly"}
              value={formik.values.data[index]?.metered_sale}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "CASH METERED SALES VALUE(£)",
      selector: (row) => row.metered_sale_value,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.metered_sale_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`metered_sale_value-${index}`}
              name={`data[${index}].metered_sale_value`}
              className={"table-input readonly"}
              value={formik.values.data[index]?.metered_sale_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJ(ℓ)",
      selector: (row) => row.adjustment,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.adjustment}
              value={myAdjustmentValue ? myAdjustmentValue : row.adjustment}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`adjustment-${index}`}
              name={`data[${index}].adjustment`}
              className={
                row.update_adjustment
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.adjustment}
              step="0.010"
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "BUNKERED SALES VOL.(ℓ)",
      selector: (row) => row.bunkered_sale,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.bunkered_sale}
              value={
                myBunkeredSalesValue ? myBunkeredSalesValue : row.bunkered_sale
              }
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`bunkered_sale-${index}`}
              name={`data[${index}].bunkered_sale`}
              className={
                row.update_bunkered_sale
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.bunkered_sale}
              step="0.010"
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "TEST(ℓ)",
      selector: (row) => row.tests,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.tests}
              value={myTestsValue ? myTestsValue : row.tests}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`tests-${index}`}
              name={`data[${index}].tests`}
              className={
                row.update_tests
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.tests}
              step="0.010"
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ACTUAL SALES VOL.(ℓ)",
      selector: (row) => row.actual_sales,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.actual_sales}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`actual_sales-${index}`}
              name={`data[${index}].actual_sales`}
              className={
                row.update_actual_sales
                  ? "UpdateValueInput"
                  : editable?.update_actual_sales
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.actual_sales}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DUE SALES (£)(ACTUAL SALES VOL. X PRICE)",
      selector: (row) => row.due_sales,
      sortable: false,
      width: "10.6%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={myDueSalesValue == 0.0 ? row.due_sales : myDueSalesValue}
              // value={myDueSalesValue ? myDueSalesValue : row.due_sales}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`due_sales-${index}`}
              name={`data[${index}].due_sales`}
              className={
                row.update_due_sales
                  ? "UpdateValueInput"
                  : editable?.update_due_sales
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.due_sales}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];
  const CombinedVarianceColumns = [
    {
      name: "DESCRIPTION",
      selector: (row) => row.description, // Update the selector to use a function
      sortable: true,
      center: false,
      width: "50%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.description}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "VARIANCE",
      selector: (row) => row.variance,
      sortable: false,
      width: "50%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance-${index}`}
            name={`Combinedvariance[${index}].variance`}
            className={" table-input readonly"}
            value={formik.values?.Combinedvariance?.[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];
  const VarianceColumns = [
    {
      name: "DESCRIPTION",
      selector: (row) => row.description, // Update the selector to use a function
      sortable: true,
      center: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.description}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "DUE SALES",
      selector: (row) => row.due_sales,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`due_sales-${index}`}
            name={`Variancedataformik[${index}].due_sales`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.due_sales || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "SALE VALUE",
      selector: (row) => row.sale_value,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`sale_value-${index}`}
            name={`Variancedataformik[${index}].sale_value`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.sale_value || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE",
      selector: (row) => row.variance,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance-${index}`}
            name={`Variancedataformik[${index}].variance`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
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
                <h3 className="card-title">Fuel-Inventory</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className="table-responsive deleted-table">
                    {data?.length > 0 ? (
                      <>
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

                    <Row className="mt-4">
                      <Card>
                        <Card.Header>
                          <h3 className="card-title">Variance for Report</h3>
                        </Card.Header>
                        <Card.Body>
                          <Col lg={12} md={12}>
                            {VarianceDataa?.length > 0 ? (
                              <>
                                <DataTable
                                  columns={VarianceColumns}
                                  data={VarianceDataa}
                                  noHeader
                                  defaultSortField="id"
                                  defaultSortAsc={false}
                                  striped={true}
                                  persistTableHead
                                  highlightOnHover
                                  searchable={false}
                                  responsive
                                />
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
                        </Card.Body>
                      </Card>
                    </Row>
                    <Row>
                      <Card>
                        <Card.Header>
                          <h3 className="card-title">Combined Variance</h3>
                        </Card.Header>
                        <Card.Body>
                          <Col lg={12} md={12} style={{ overflow: "hidden" }}>
                            {CombinedVarianceData?.length > 0 ? (
                              <>
                                <DataTable
                                  columns={CombinedVarianceColumns}
                                  data={CombinedVarianceData}
                                  noHeader
                                  defaultSortField="id"
                                  defaultSortAsc={false}
                                  striped={true}
                                  persistTableHead
                                  highlightOnHover
                                  searchable={false}
                                  responsive
                                />
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
                        </Card.Body>
                      </Card>
                    </Row>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default FuelInventry;
