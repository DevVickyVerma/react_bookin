import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import CustomModal from "../../../data/Modal/MiddayModal";
import { MultiSelect } from "react-multi-select-component";

const FuelPrices = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;

  const [editable, setis_editable] = useState();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [headingData, setheadingData] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
  }, []);

  const handleSubmit1 = async (values) => {
    setSelectedCompanyId(values.company_id);
    setSelectedDrsDate(values.start_date);

    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      // ...

      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${values.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
      }
      const response1 = await getData(
        `site/fuel-price?${clientIDCondition}company_id=${values.company_id}&drs_date=${values.start_date}`
      );
      const { data } = response1;

      if (data) {
        if (data.api_response === "success") {
          setheadingData(data.data?.head_array || []);
          setData(data.data || {});
          setis_editable(data.data?.btn_clickable || false);
          setIsChecked(data.data?.notify_operator || false);
        } else {
          // Handle the error case
          // You can display an error message or take appropriate action
          console.error(data.message);
        }
      } else {
        // Handle the case where data is null
        // You may want to set default values or handle it differently
        setheadingData([]);
        setData({});
        setis_editable(false);
        setIsChecked(false);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [data, setData] = useState();
  const renderTableHeader = () => {
    return (
      <tr className="fuelprice-tr" style={{ padding: "0px" }}>
        {data?.head_array &&
          data.head_array.map((item, index) => <th key={index}>{item}</th>)}
      </tr>
    );
  };

  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDate, setSelectedItemDate] = useState();
  const handleModalOpen = (item) => {
    setSelectedItem(item); // Set the selected item
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const renderTableData = () => {
    return data?.listing?.map((item) => (
      <tr className="fuelprice-tr" key={item?.id} style={{ padding: "0px" }}>
        <td style={{ maxWidth: "14.28%" }}>
          <span
            className={
              item?.link_clickable
                ? "text-muted fs-15 fw-semibold text-center fuel-site-name"
                : "text-muted fs-15 fw-semibold text-center"
            }
            onClick={item?.link_clickable ? () => handleModalOpen(item) : null}
          >
            {item?.site_name} <span className="itemcount">{item?.count}</span>
          </span>
        </td>
        <td>
          <span className="text-muted fs-15 fw-semibold text-center">
            {item?.time}
          </span>
        </td>

        {Array.isArray(item?.fuels) &&
          item.fuels.map((fuel, index) => (
            <td key={index}>
              {Array.isArray(fuel) ? (
                <input type="text" className="table-input readonly" readOnly />
              ) : (
                <input
                  type="number"
                  step="0.010"
                  className={`table-input ${fuel?.status === "UP"
                    ? "table-inputGreen"
                    : fuel?.status === "DOWN"
                      ? "table-inputRed"
                      : ""
                    } ${!fuel?.is_editable ? "readonly" : ""}`}
                  value={fuel?.price}
                  readOnly={!fuel?.is_editable}
                  id={fuel?.id}
                  onChange={(e) =>
                    handleInputChange(e.target.id, e.target.value)
                  }
                />
              )}
            </td>
          ))}
      </tr>
    ));
  };

  const handleInputChange = (id, value) => {
    const updatedData = {
      ...data,
      listing: data?.listing?.map((item) => ({
        ...item,
        fuels: item.fuels.map((fuel) =>
          fuel.id === id ? { ...fuel, price: value } : fuel
        ),
      })),
    };

    setData(updatedData);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      data?.listing?.forEach((item) => {
        const siteId = item.id;

        item.fuels.forEach((fuel) => {
          if (!Array.isArray(fuel) && fuel.price !== undefined) {
            const priceId = fuel.id;
            const fieldKey = `fuels[${siteId}][${priceId}]`;
            const timeKey = `time[${siteId}][${priceId}]`;
            const fieldValue = fuel.price.toString();
            const fieldtime = fuel.time;
            formData.append(fieldKey, fieldValue);
            formData.append(timeKey, fieldtime);
          }
        });
      });

      const isMobileSelected = selected.some(option => option.value === "mobile-sms");
      const isEmailSelected = selected.some(option => option.value === "email");

      setSelectedItemDate(selectedDrsDate);
      formData.append("send-sms", isMobileSelected);
      formData.append("notify_operator", isEmailSelected);
      formData.append("drs_date", selectedDrsDate);
      formData.append("client_id", selectedClientId);
      formData.append("company_id", selectedCompanyId);

      const response = await postData(
        "/site/fuel-price/update-midday",
        formData
      );

      if (apidata.status_code === "200") {
        const values = {
          start_date: selectedDrsDate,
          client_id: selectedClientId,
          company_id: selectedCompanyId,
        };
        handleSubmit1(values);
      }
      // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const SendNotification = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleDataFromChild = async (dataFromChild) => {
    try {
      // Assuming you have the 'values' object constructed from 'dataFromChild'
      const values = {
        start_date: selectedDrsDate,
        client_id: selectedClientId,
        company_id: selectedCompanyId,
      };

      await handleSubmit1(values);
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };

  const headerHeight = 135;

  const containerStyles = {
    // overflowY: "scroll", // or 'auto'
    // overflowX: "hidden", // or 'auto'
    // maxHeight: "100vh", // Set a maximum height for the container
    // maxHeight: `calc(100vh - ${headerHeight}px)`,
    // border: "1px solid #ccc",
    // backgroundColor: "#f5f5f5",
    // padding: "10px",
  };

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      start_date: Yup.date()
        .required("Start Date is required")
        .min(
          new Date("2023-01-01"),
          "Start Date cannot be before January 1, 2023"
        ),
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
          console.log(response, "company");
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
          console.log(response, "company");
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
      fetchCommonListData();
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
    }
  }, []);



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="overflow-container" style={containerStyles}>
        <CustomModal
          open={modalOpen}
          onClose={handleModalClose}
          selectedItem={selectedItem}
          selectedDrsDate={selectedDrsDate}
          onDataFromChild={handleDataFromChild}
        />
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel Price</h1>
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
                Fuel Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Card.Body>
                      <Row>
                        {localStorage.getItem("superiorRole") !== "Client" && (
                          <Col lg={4} md={4}>
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
                                    formik.setFieldValue(
                                      "client_id",
                                      selectedType
                                    );
                                    setSelectedClientId(selectedType);
                                    setSiteList([]);
                                    formik.setFieldValue("company_id", "");
                                    formik.setFieldValue("site_id", "");

                                    const selectedClient =
                                      ClientList?.data?.find(
                                        (client) => client.id === selectedType
                                      );
                                    if (selectedClient) {
                                      formik.setFieldValue(
                                        "client_name",
                                        selectedClient?.client_name
                                      );
                                    }
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
                                {ClientList.data &&
                                  ClientList.data.length > 0 ? (
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
                        )}

                        <Col Col lg={4} md={4}>
                          <div className="form-group">
                            <label
                              htmlFor="company_id"
                              className="form-label mt-4"
                            >
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
                                  formik.setFieldValue(
                                    "company_id",
                                    selectcompany
                                  );
                                  formik.setFieldValue("site_id", "");
                                  setSelectedCompanyId(selectcompany);

                                  const selectedCompanyData = CompanyList?.find(
                                    (company) => company?.id === selectcompany
                                  );
                                  if (selectedCompanyData) {
                                    formik.setFieldValue(
                                      "company_name",
                                      selectedCompanyData?.company_name
                                    );
                                    formik.setFieldValue(
                                      "company_id",
                                      selectedCompanyData?.id
                                    );
                                    // setSelectedCompanyFullData(selectedCompanyData)
                                  }
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

                        <Col lg={4} md={4}>
                          <div className="form-group">
                            <label
                              htmlFor="start_date"
                              className="form-label mt-4"
                            >
                              Start Date
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`input101 ${formik.errors.start_date &&
                                formik.touched.start_date
                                ? "is-invalid"
                                : ""
                                }`}
                              type="date"
                              min="2023-01-01"
                              onChange={(e) => {
                                const selectedstart_date = e.target.value;
                                formik.setFieldValue(
                                  "start_date",
                                  selectedstart_date
                                );
                                // You can keep the logic for setting the field value here if needed
                              }}
                              id="start_date"
                              name="start_date"
                              onClick={hadndleShowDate}
                              value={formik.values.start_date}
                            />
                            {formik.errors.start_date &&
                              formik.touched.start_date && (
                                <div className="invalid-feedback">
                                  {formik.errors.start_date}
                                </div>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <hr />
                    </Card.Body>
                    <Card.Footer
                      className="text-end"
                      style={{ border: "none" }}
                    >
                      <button className="btn btn-primary me-2" type="submit">
                        Submit
                      </button>
                    </Card.Footer>
                  </Row>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card
              style={{
                //  height: "calc(100vh - 180px)",
                overflowY: "auto"
              }}
            >
              <Card.Header>
                <h3 className="card-title">Fuel Price</h3>
              </Card.Header>
              <Card.Body>
                {data?.head_array ? (
                  <div
                    className="table-container table-responsive"
                    // style={{ height: "700px", overflowY: "auto" }}
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 376px )",
                    }}
                  // height:"245"
                  >
                    <table className="table">
                      <colgroup>
                        {data?.head_array &&
                          data.head_array.map((_, index) => (
                            <col key={index} />
                          ))}
                      </colgroup>
                      <thead
                        style={{
                          position: "sticky",
                          top: "0",
                          width: "100%",
                        }}
                      >
                        <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                      </thead>
                      <tbody>{renderTableData()}</tbody>
                    </table>
                  </div>
                ) : (
                  <img
                    src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                )}
              </Card.Body>
              <Card.Footer>
                {data?.head_array ? (
                  <div className="text-end notification-class">
                    <div style={{ width: "200px", textAlign: "left" }} >

                      {!selected.length && (
                        <>
                          {setSelected([{ label: "Send Notification Type", value: "", disabled: true }])}
                        </>
                      )}
                      <MultiSelect
                        value={selected}
                        onChange={(values) => {
                          // Remove the placeholder option if it's selected
                          const updatedSelection = values.filter((value) => value.value !== "");
                          setSelected(updatedSelection);
                        }}
                        labelledBy="Notification Type"
                        disableSearch="true"
                        options={[
                          { label: "Mobile SMS Notification", value: "mobile-sms" },
                          { label: "Email Notification", value: "email" }
                        ]}
                        showCheckbox="false"
                        style={{ width: "200px" }}
                        placeholder="Select Notification Type"
                      />

                    </div>

                    {data?.btn_clickable ? (
                      <button
                        className="btn btn-primary me-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(FuelPrices);
