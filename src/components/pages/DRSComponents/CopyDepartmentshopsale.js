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

const Departmentshopsale = (props) => {
  const {
    apidata,
    error,
    getData,
    postData,
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
  const [myGrossTotalValue, setMyGrossTotalValue] = useState();
  const [myDiscTotalValue, setMyDiscTotalValue] = useState();
  const [myNetTotalValue, setMyNetTotalValue] = useState();
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
          `/department-shop-sale/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setis_editable(data?.data ? data.data : {});

          //   {
          //     "id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
          //     "site_id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
          //     "department_item_id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
          //     "category_name": "Tobacco",
          //     "gross_value": "38.37000",
          //     "disc_value": "0.00000",
          //     "nett_value": "31.97000",
          //     "vat": null,
          //     "ex_vat_value": null,
          //     "department_sale_date": "2023-06-11",
          //     "created_date": "2023-06-12",
          //     "updated_date": "2023-06-13",
          //     "update_gross_value": false,
          //     "update_nett_value": false,
          //     "update_disc_value": false
          // }

          // Create an array of form values based on the response data
          const formValues = data?.data?.listing
            ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  gross_value: item.gross_value,
                  disc_value: item.disc_value,
                  nett_value: item.nett_value,
                  adjust: item.adjust,
                  sale: item.sale,
                  price: item.price,
                  value: item.value,
                  com_rate: item.com_rate,
                  commission: item.commission,
                  // value_per: item.value_per ,
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        gross_value,
        disc_value,
        nett_value,
        adjust,
        sale,
        price,
        value,
        commission,
        value_per,
        com_rate,
      } = obj;
      const gross_valueKey = `gross_value[${id}]`;
      const discountKey = `disc_value[${id}]`;
      const nettValueKey = `nett_value[${id}]`;

      formData.append(gross_valueKey, gross_value);
      formData.append(discountKey, disc_value);
      formData.append(nettValueKey, nett_value);
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/department-shop-sale/update`,
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
        handleButtonClick();
        SuccessToast(responseData.message);
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

  const handleChangeForUpdate = async (values) => {
    let totalGrossValue = 0;
    let totalDiscValue = 0;
    let totalNettValue = 0;

    for (let i = 0; i < values.data.length - 1; i++) {
      const obj = values.data[i];

      const gross_value = parseFloat(obj.gross_value);
      if (!isNaN(gross_value)) {
        totalGrossValue += gross_value;
      }

      // Calculate total disc_value
      const disc_value = parseFloat(obj.disc_value);
      if (!isNaN(disc_value)) {
        totalDiscValue += disc_value;
      }

      // Calculate total nett_value
      const nett_value = parseFloat(obj.nett_value);
      if (!isNaN(nett_value)) {
        totalNettValue += nett_value;
      }
    }

    setMyGrossTotalValue(totalGrossValue);
    setMyDiscTotalValue(totalDiscValue);
    setMyNetTotalValue(totalNettValue);

    console.log("totalDiscValue", totalDiscValue);
  };

  const columns = [
    // ... existing columns

    {
      name: "ITEM NAME",
      selector: (row) => row.category_name,
      sortable: false,
      width: "25%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.category_name !== undefined ? `${row.category_name}` : ""}
        </span>
      ),
    },
    {
      name: "	GROSS VALUE",
      selector: (row) => row.gross_value,
      sortable: false,
      width: "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={Number(row.gross_value) + Number(myGrossTotalValue)}
              value={myGrossTotalValue ? myGrossTotalValue : ""}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`gross_value-${index}`}
              name={`data[${index}].gross_value`}
              className={
                row.update_gross_value
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.gross_value}
              // onChange={formik.handleChange}

              onChange={(event) => {
                formik.handleChange(event);
              }}
              onBlur={(event) => {
                formik.handleBlur(event);
                handleChangeForUpdate(formik.values);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "	DISC VALUE ",
      selector: (row) => row.disc_value,
      sortable: false,
      width: "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.disc_value}
              value={myDiscTotalValue ? myDiscTotalValue : ""}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`disc_value-${index}`}
              name={`data[${index}].disc_value`}
              className={
                row.update_disc_value
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.disc_value}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              onBlur={(event) => {
                formik.handleBlur(event);
                handleChangeForUpdate(formik.values);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
          </div>
        ),
    },
    {
      name: "	NETT VALUE",
      selector: (row) => row.nett_value,
      sortable: false,
      width: "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.nett_value}
              value={myNetTotalValue ? myNetTotalValue : ""}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`nett_value-${index}`}
              name={`data[${index}].nett_value`}
              className={
                row.update_nett_value
                  ? "UpdateValueInput"
                  : editable?.is_editable
                  ? "table-input"
                  : "table-input readonly"
              }
              value={formik.values.data[index]?.nett_value}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              onBlur={(event) => {
                formik.handleBlur(event);
                handleChangeForUpdate(formik.values);
              }}
              readOnly={editable?.is_editable ? false : true}
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
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Department Shop Sales</h3>
              </Card.Header>
              <Card.Body>
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
                  {data.length > 0 ? (
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
                  ) : (
                    ""
                  )}
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default Departmentshopsale;
