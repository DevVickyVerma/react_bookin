import React, { useEffect, useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import Loaderimg from "../../../Utils/Loader";
import Select from "react-select";
import { useFormik } from "formik";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";

const DepartmentShop = (props) => {
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

  useEffect(() => {
    fetchDetails();
    fetchListing();
    console.clear();
  }, []);

  const [data, setData] = useState([]);
  const [DieselID, setDieselID] = useState([]);
  const [Listingdata, setListingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setis_editable] = useState();

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
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
  const SALESdummyData = [
    {
      card: "",
      koisk: 0,
      optvalue: 0,
      accountvalue: 0,
      transactionsvalue: 0,
    },

    // Add more dummy data items as needed
  ];

  const dummyData = [
    {
      volume: 0,
      value: 0,
      fuel_id: 0,
      card: "",
    },

    // Add more dummy data items as needed
  ];
  const DieselData = [
    {
      diesel: "Diesel",
      volume: 0,
      value: 0,
      card: "",
      id: 0,
      fuel_id: DieselID,
    },
  ];

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get(
        `/bunkered-sale/details/?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data ? data.data : []);

        const filteredDieselIds = data?.data?.siteFuels
          .filter((fuel) => fuel.fuel_name === "Diesel")
          .map((fuel) => fuel.id);

        setDieselID(filteredDieselIds);
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchListing = async () => {
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get(
        `/bunkered-sale/list/?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setListingData(data?.data?.listing ? data.data : []);
        if (data?.data?.listing) {
          setis_editable(response?.data?.data);
          const bunkeredSalesValues = data?.data?.listing?.bunkered_Sales.map(
            (sale) => ({
              diesel: sale.fuel_name,
              volume: sale.volume || "",
              value: sale.value || "",
              card: sale.card_id,

              fuel_id: sale.fuel_id || "",

              id: sale.id || "",
            })
          );

          const valuesToSetDieselData =
            bunkeredSalesValues.length > 0 ? bunkeredSalesValues : DieselData;

          formik.setFieldValue("bunkeredSales", valuesToSetDieselData);

          const nonbunkeredsalesValues =
            data?.data?.listing?.non_bunkered_sales?.map((sale) => ({
              fuel: sale.fuel_id,
              volume: sale.volume || "",
              value: sale.value || "",
              id: sale.id || "",
              card: sale.card_id,
              fuel_name: sale.fuel_name || "",
            }));

          // Check if nonbunkeredsalesValues has any values; otherwise, use dummyData
          const non_bunkered_values =
            nonbunkeredsalesValues.length > 0
              ? nonbunkeredsalesValues
              : dummyData;

          formik2.setFieldValue("nonbunkeredsalesvalue", non_bunkered_values);

          const creditcardvalues =
            data?.data?.listing?.bunkered_creditcardsales?.map((sale) => ({
              card: sale.card_id,
              koisk: sale.koisk_value || "",
              optvalue: sale.opt_value || "",
              accountvalue: sale.account_value || "",
              transactionsvalue: sale.no_of_transactions || "",
              id: sale.id || "",
            }));

          // Check if creditcardvalues has any values; otherwise, use dummyData
          const valuesToSet =
            creditcardvalues.length > 0 ? creditcardvalues : SALESdummyData;

          formik3.setFieldValue("creditcardvalue", valuesToSet);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    bunkeredSales: [
      {
        volume: "",
        value: "",
        card: "",
        diesel: "Diesel",
      },
    ],
  };

  const nonbunkeredsales = {
    nonbunkeredsalesvalue: [
      {
        fuel: "",
        volume: "",
        value: "",
        card: "",
      },
    ],
  };
  const creditcard = {
    creditcardvalue: [
      {
        card: "",
        koisk: "",
        optvalue: "",
        accountvalue: "",
        transactionsvalue: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    bunkeredSales: Yup.array().of(
      Yup.object().shape({
        fuel: Yup.string().required("Please select a fuel"),

        card: Yup.string().required("Please select a tank"),
        volume: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        value: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });

  const nonbunkeredsalesValidationSchema = Yup.object().shape({
    nonbunkeredsalesvalue: Yup.array().of(
      Yup.object().shape({
        fuel: Yup.string().required("Please select a fuel"),
        volume: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        value: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });
  const creditcardValidationSchema = Yup.object().shape({
    creditcardvalue: Yup.array().of(
      Yup.object().shape({
        card: Yup.string().required("Please select a fuel"),
        koisk: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        optvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
        accountvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
        transactionsvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });

  const onSubmit = (values, { resetForm }) => {
    resetForm();
    // pushbunkeredSalesRow();
    SuccessToast("Data submitted successfully!");
  };

  const nonbunkeredsalesonSubmit = (values, { resetForm }) => {
    resetForm();
    pushnonbunkeredSalesRow();
  };
  const creditcardonSubmit = (values, { resetForm }) => {
    resetForm();
    pushnoncreditcardRow();
  };

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: onSubmit,
  });

  const formik2 = useFormik({
    initialValues: nonbunkeredsales,
    validationSchema: nonbunkeredsalesValidationSchema,
    onSubmit: nonbunkeredsalesonSubmit,
  });
  const formik3 = useFormik({
    initialValues: creditcard,
    validationSchema: creditcardValidationSchema,
    onSubmit: creditcardonSubmit,
  });

  const pushnonbunkeredSalesRow = () => {
    if (formik2.isValid) {
      formik2.values.nonbunkeredsalesvalue.push({
        fuel: null,
        volume: "",
        value: "",
      });
      formik2.setFieldValue(
        "nonbunkeredsalesvalue",
        formik2.values.nonbunkeredsalesvalue
      );
    } else {
      ErrorToast(
        "Please fill all fields correctly before adding a new non-bunkered sales row."
      );
    }
  };

  const pushbunkeredSalesRow = () => {
    if (formik.isValid) {
      formik.values.bunkeredSales.push({
        volume: "",
        value: "",
        card: "",
      });
      formik.setFieldValue("bunkeredSales", formik.values.bunkeredSales);
    } else {
      ErrorToast(
        "Please fill all fields correctly before adding a new bunkered sales row."
      );
    }
  };
  const pushnoncreditcardRow = () => {
    if (formik3.isValid) {
      formik3.values.creditcardvalue.push({
        card: "",
        koisk: "",
        optvalue: "",
        accountvalue: "",
        transactionsvalue: "",
      });

      // Update the creditcardvalue array in the formik values
      formik3.setFieldValue("creditcardvalue", formik3.values.creditcardvalue);
    } else {
      ErrorToast(
        "Please fill all fields correctly before adding a new credit card  sales row."
      );
    }
  };

  const removecreditcardRow = (index) => {
    const updatedRows = [...formik3.values.creditcardvalue];
    updatedRows.splice(index, 1);
    formik3.setFieldValue("creditcardvalue", updatedRows);
  };

  const removebunkeredSalesRow = (index) => {
    const updatedRows = [...formik.values.bunkeredSales];
    updatedRows.splice(index, 1);
    formik.setFieldValue("bunkeredSales", updatedRows);
  };

  const removenonbunkeredSalesRow = (index) => {
    const updatedRows = [...formik2.values.nonbunkeredsalesvalue];
    updatedRows.splice(index, 1);
    formik2.setFieldValue("nonbunkeredsalesvalue", updatedRows);
  };

  const combinedOnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_BASE_URL; // Replace with your actual base URL

      const formData = new FormData();

      // Append data from formik.values.bunkeredSales
      for (const obj of formik.values?.bunkeredSales) {
        const { id, fuel_id, volume, value, card } = obj;

        formData.append(`bunkered_sale_id[0]`, id ? id : 0);
        formData.append(`bunkered_sale_fuel_id[${id ? id : 0}]`, DieselID);
        formData.append(`bunkered_sale_volume[${id ? id : 0}]`, volume);
        formData.append(`bunkered_sale_value[${id ? id : 0}]`, value);

        formData.append(`bunkered_sale_card_id[${id ? id : 0}]`, card);
      }

      // Append data from formik3.values.creditcardvalue
      for (const obj of formik3.values?.creditcardvalue) {
        const { id, card, koisk, optvalue, accountvalue, transactionsvalue } =
          obj;
        if (id !== null && id !== "") {
          formData.append(`bunkered_credit_card_sales_id[]`, id ? id : 0);
        }

        if (card !== null && card !== "") {
          formData.append(
            `bunkered_credit_card_sales_card_id[${id ? id : 0}]`,
            card
          );
        }

        if (koisk !== null && koisk !== "") {
          formData.append(
            `bunkered_credit_card_sales_koisk_value[${id ? id : 0}]`,
            koisk
          );
        }

        if (optvalue !== null && optvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_opt_value[${id ? id : 0}]`,
            optvalue
          );
        }

        if (accountvalue !== null && accountvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_account_value[${id ? id : 0}]`,
            accountvalue
          );
        }

        if (transactionsvalue !== null && transactionsvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_no_of_transactions[${id ? id : 0}]`,
            transactionsvalue
          );
        }
      }

      // Append data from formik2.values.nonbunkeredsalesvalue
      for (const obj of formik2.values?.nonbunkeredsalesvalue) {
        const { id, fuel, volume, value, card } = obj;

        // Assuming you have the variables id, fuel, volume, and value with their respective values

        if (id !== null && id !== "") {
          formData.append(`nonbunkered_id[0]`, id ? id : 0);
        }

        if (fuel !== null && fuel !== "") {
          formData.append(`nonbunkered_fuel_id[${id ? id : 0}]`, fuel);
        }
        if (card !== null && card !== "") {
          formData.append(`nonbunkered_card_id[${id ? id : 0}]`, card);
        }

        if (volume !== null && volume !== "") {
          formData.append(`nonbunkered_volume[${id ? id : 0}]`, volume);
        }

        if (value !== null && value !== "") {
          formData.append(`nonbunkered_value[${id ? id : 0}]`, value);
        }
      }
      formData.append("site_id", site_id);
      formData.append("drs_date", start_date);

      setIsLoading(true);
      const response = await fetch(`${baseURL}/bunkered-sale/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        handleButtonClick();
        // Call your success toast function here
        // Replace SuccessToast with your actual function that shows a success message
        SuccessToast(responseData.message);
      } else {
        // Call your error toast function here
        // Replace ErrorToast with your actual function that shows an error message
        ErrorToast(responseData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  // Call the submitData function when the combinedOnSubmit function is invoked

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> BUNKERED SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik.values.bunkeredSales.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].diesel`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            type="text"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.diesel &&
                              formik.touched[`bunkeredSales[${index}].diesel`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].diesel`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.diesel ||
                              "Diesel"
                            }
                            readOnly
                          />
                          {formik.errors.bunkeredSales?.[index]?.diesel &&
                            formik.touched[
                              `bunkeredSales[${index}].diesel`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].diesel}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group controlId={`bunkeredSales[${index}].card`}>
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.card &&
                              formik.touched[`bunkeredSales[${index}].card`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].card`}
                            onChange={formik.handleChange}
                            value={delivery?.card || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.bunkeredSales?.[index]?.card &&
                            formik.touched[`bunkeredSales[${index}].card`] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].card}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.volume &&
                              formik.touched[`bunkeredSales[${index}].volume`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].volume`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.volume ||
                              ""
                            }
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik.errors.bunkeredSales?.[index]?.volume &&
                            formik.touched[
                              `bunkeredSales[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].volume}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group controlId={`bunkeredSales[${index}].value`}>
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.value &&
                              formik.touched[`bunkeredSales[${index}].value`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].value`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.value ||
                              ""
                            }
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik.errors.bunkeredSales?.[index]?.value &&
                            formik.touched[`bunkeredSales[${index}].value`] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={2} md={2}>
                        {editable?.is_editable ? (
                          <Form.Label>ACTION</Form.Label>
                        ) : (
                          ""
                        )}
                        {editable?.is_editable ? (
                          <div className="bunkered-action">
                            <button
                              className="btn btn-primary me-2"
                              onClick={() => removebunkeredSalesRow(index)}
                            >
                              <RemoveCircleIcon />
                            </button>
                            {index ===
                              formik.values.bunkeredSales.length - 1 && (
                              <button
                                className="btn btn-primary me-2"
                                type="button"
                                onClick={pushbunkeredSalesRow}
                              >
                                <AddBoxIcon />
                              </button>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> NON BUNKERED SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik2.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik2.values.nonbunkeredsalesvalue.map((item, index) => (
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].fuel`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.fuel &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].fuel`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].fuel`}
                            onChange={formik2.handleChange}
                            value={item?.fuel || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a Fuel</option>
                            {data?.siteFuels?.map((fuel) => (
                              <option key={fuel.id} value={fuel.id}>
                                {fuel.fuel_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.fuel &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].fuel`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .fuel
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].card`}
                        >
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.card &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].card`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].card`}
                            onChange={formik2.handleChange}
                            value={item?.card || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.card &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].card`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .card
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.volume &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].volume`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].volume`}
                            onChange={formik2.handleChange}
                            value={item?.volume || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.volume &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .volume
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].value`}
                        >
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.value &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].value`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].value`}
                            onChange={formik2.handleChange}
                            value={item?.value || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.value &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].value`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .value
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={2} md={2}>
                        {editable?.is_editable ? (
                          <Form.Label>ACTION</Form.Label>
                        ) : (
                          ""
                        )}
                        {editable?.is_editable ? (
                          <div className="bunkered-action">
                            <button
                              className="btn btn-primary me-2"
                              onClick={() => removenonbunkeredSalesRow(index)}
                            >
                              <RemoveCircleIcon />
                            </button>
                            {index ===
                              formik2.values.nonbunkeredsalesvalue.length -
                                1 && (
                              <button
                                className="btn btn-primary me-2"
                                type="button"
                                onClick={pushnonbunkeredSalesRow}
                              >
                                <AddBoxIcon />
                              </button>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> BUNKERED CREDIT CARD SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik3.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik3.values.creditcardvalue.map((item, index) => (
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].card`}
                        >
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]?.card &&
                              formik3.touched[`creditcardvalue[${index}].card`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].card`}
                            onChange={formik3.handleChange}
                            value={item?.card || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik3.errors.creditcardvalue?.[index]?.card &&
                            formik3.touched[
                              `creditcardvalue[${index}].card`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].card}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].koisk`}
                        >
                          <Form.Label>KOISK VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]?.koisk &&
                              formik3.touched[`creditcardvalue[${index}].koisk`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].koisk`}
                            onChange={formik3.handleChange}
                            value={item?.koisk || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik3.errors.creditcardvalue?.[index]?.koisk &&
                            formik3.touched[
                              `creditcardvalue[${index}].koisk`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].koisk}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].optvalue`}
                        >
                          <Form.Label>OPT VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.optvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].optvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].optvalue`}
                            onChange={formik3.handleChange}
                            value={item?.optvalue || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik3.errors.creditcardvalue?.[index]?.optvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].optvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].optvalue}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].accountvalue`}
                        >
                          <Form.Label> ACCOUNT VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.accountvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].accountvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].accountvalue`}
                            onChange={formik3.handleChange}
                            value={item?.accountvalue || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik3.errors.creditcardvalue?.[index]
                            ?.accountvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].accountvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.creditcardvalue[index]
                                    .accountvalue
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].transactionsvalue`}
                        >
                          <Form.Label> NO. OF TRANSACTIONS :</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.transactionsvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].transactionsvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].transactionsvalue`}
                            onChange={formik3.handleChange}
                            value={item?.transactionsvalue || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik3.errors.creditcardvalue?.[index]
                            ?.transactionsvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].transactionsvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.creditcardvalue[index]
                                    .transactionsvalue
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <>
                          {editable?.is_editable ? (
                            <Form.Label>ACTION</Form.Label>
                          ) : (
                            ""
                          )}
                          {editable?.is_editable ? (
                            <div className="bunkered-action">
                              <button
                                className="btn btn-primary me-2"
                                onClick={() =>
                                  editable?.is_editable
                                    ? removecreditcardRow(index)
                                    : null
                                }
                                type="button"
                              >
                                <RemoveCircleIcon />
                              </button>

                              {index ===
                                formik3.values.creditcardvalue.length - 1 && (
                                <button
                                  className="btn btn-primary me-2"
                                  type="button"
                                  onClick={pushnoncreditcardRow}
                                >
                                  <AddBoxIcon />
                                </button>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                {editable?.is_editable ? (
                  <div className="bunkered-action">
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={combinedOnSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentShop;
