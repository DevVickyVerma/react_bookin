import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import axios from "axios";
import { AiFillCaretDown, AiFillCaretRight, AiOutlineArrowRight } from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import CompetitorSingleGraph from "./CompetitorSingleGraph";
import { Box, Typography } from "@mui/material";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import moment from "moment";

const SingleStatsCompetitor = ({ isLoading, getData }) => {
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [Compititorloading, setCompititorloading] = useState(false);
  const { id } = useParams();
  const [selected, setSelected] = useState();
  const [mySelectedDate, setMySelectedDate] = useState();

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const navigate = useNavigate();

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(" ")
        : error.response?.data?.message;
      ErrorAlert(errorMessage);
    }
  }

  const FetchCompititorData = async (selectedValues) => {
    setCompititorloading(true);
    if (localStorage.getItem("Dashboardsitestats") === "true") {
      try {
        // Use async/await to fetch data
        const response3 = await axiosInstance.get(
          selectedValues?.start_date
            ? `/dashboard/get-competitors-price?site_id=${id}&drs_date=${selectedValues?.start_date}`
            : `/dashboard/get-competitors-price?site_id=${id}`
        );

        if (response3 && response3.data) {
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        console.error("API error:", error);
        handleError(error);
      } finally {
        // Set Compititorloading to false when the request is complete (whether successful or not)
        setCompititorloading(false);
      }
    }
  };

  const handleClientStats = async () => {
    try {
      const response = await getData(
        `/client/sites`
      );


      const { data } = response;
      if (data) {
        setSelected(data?.data);
      }

    } catch (error) {
      console.error("API error:", error);
    } // Set the submission state to false after the API call is completed
  };
  useEffect(() => {
    FetchCompititorData();
    handleClientStats();
  }, [id]);
  if (Compititorloading) {
    return <Loaderimg />;
  }

  if (!getCompetitorsPrice) {
    return (<Row
      style={{
        marginBottom: "10px",
        marginTop: "20px",
      }}
    >
      <Col lg={12} md={12}>
        <Card>
          <Card.Header className="card-header">
            <h4 className="card-title"> Local Competitor Stats</h4>
          </Card.Header>
          <Card.Body className="card-body pb-0 overflow-auto"> <img
            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
            alt="MyChartImage"
            className="all-center-flex nodata-image"
          />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    );
  }

  const data = getCompetitorsPrice?.competitorListing;
  const animatedComponents = makeAnimated();
  const Optionssingle = selected?.map(item => ({
    value: item?.id,
    label: item?.site_name
  }))

  const handleSitePathChange = (values) => {
    navigate(`/sitecompetitor/${values.value}`)
  }

  const byDefaultSelectValue = {
    value: id,
    label: getCompetitorsPrice?.siteName
  }

  const twoMonthsAgo = new Date(getCompetitorsPrice?.last_dayend);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);


  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };


  // Format twoMonthsAgo as "YYYY-MM-DD"
  const formattedTwoMonthsAgo = twoMonthsAgo.toISOString().split('T')[0];

  return (
    <>
      {Compititorloading ? <Loaderimg /> : null}
      <div className="page-header d-flex flex-wrap">
        <div>
          <h1 className="page-title ">
            {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
            Competitors{" "}
          </h1>
          <Breadcrumb className="breadcrumb breadcrumb-subheader">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/competitorstats" }}
            >
              Competitor Stats
            </Breadcrumb.Item>

            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
              Competitors
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="ms-auto d-flex  gap-2 flex-wrap">
          <div>

            <label>
              Filter By Site:
            </label>
            <div style={{ width: "200px" }}>

              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={Optionssingle}
                onChange={(value) => handleSitePathChange(value)}
                className="test"
                value={byDefaultSelectValue}
              />
            </div>

          </div>

          <div >
            <Formik
              initialValues={{
                start_date: mySelectedDate || "",
              }}
              validationSchema={Yup.object().shape({
                start_date: Yup.date().required(
                  "Start Date is required"
                ),
              })}
              onSubmit={(values) => {
                FetchCompititorData(values);
              }}
            >
              {({ handleSubmit, errors, touched, setFieldValue }) => (
                <Form onSubmit={handleSubmit} style={{ marginTop: "-11px", display: "flex", alignItems: "center" }} >

                  <div>
                    <label
                      htmlFor="start_date"
                      className="form-label "
                    >
                      Date
                    </label>
                    <Field
                      type="date"
                      min={formattedTwoMonthsAgo}
                      max={getCompetitorsPrice?.last_dayend}
                      onClick={handleShowDate}
                      className={`input101 compi-calender ${errors.start_date && touched.start_date
                        ? "is-invalid"
                        : ""
                        }`}
                      id="start_date"
                      name="start_date"
                      value={mySelectedDate}
                      onChange={(e) => {
                        const selectedstart_date =
                          e.target.value;
                        setMySelectedDate(selectedstart_date);
                        setFieldValue(
                          "start_date",
                          selectedstart_date
                        );
                      }}
                    ></Field>
                    <ErrorMessage
                      component="div"
                      className="invalid-feedback"
                      name="start_date"
                    />
                  </div>
                  <div
                    style={{ marginTop: "38px", alignSelf: "baseline" }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary mx-2"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>


          </div>



        </div>
      </div>

      <>
        <Box
          display={"flex"}
          gap={"5px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
          bgcolor={"#ffffff"}
          color={"black"}
          mb={"38px"}
          py={"20px"}
          px={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Box display={"flex"} alignItems={"center"}>
            <Box>
              {" "}
              {getCompetitorsPrice?.site_image ? (
                <img
                  src={getCompetitorsPrice?.site_image}
                  alt={getCompetitorsPrice?.site_image}
                  style={{ width: "50px", height: "50px" }}
                />
              ) : (
                <span class="Smallloader"></span>
              )}
            </Box>
            <Box>
              <Typography
                fontSize={"19px"}
                fontWeight={500}
                ml={"7px"}
                variant="body1"
              >
                {getCompetitorsPrice?.siteName ? (
                  getCompetitorsPrice?.siteName
                ) : (
                  ""
                )}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT side heading title */}
          <Box gap={"20px"} display={["contents", "flex"]}>


            {/* last day end competitor */}
            <Box
              display={"flex"}
              flexDirection={"column"}
              bgcolor={"#ecf0f1"}
            >
              <Box
                my={"4px"}
                color={"#2d3436"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                px={"13px"}
              >
                <Typography fontSize={"14px"}>
                  Last Day End : { }
                  {getCompetitorsPrice?.last_dayend ? (
                    moment(getCompetitorsPrice?.last_dayend).format("Do MMM")
                  ) : (
                    <span class="Smallloader"></span>
                  )}
                </Typography>
              </Box>

              <Box display={"flex"}>
                {/* Calendar Date With Updated OPening Time*/}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    position={"relative"}
                    bgcolor={"rgb(25 122 66)"}
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                  >
                    {" "}
                    Opening Time
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      bgcolor={"rgb(25 122 66)"}
                      position={"absolute"}
                      bottom={0}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {getCompetitorsPrice?.opening ? (
                        moment(getCompetitorsPrice?.opening).format(
                          "Do MMM, HH:mm"
                        )
                      ) : (
                        <span class="Smallloader"></span>
                      )}
                    </Typography>
                  </Typography>
                </Box>
                {/* Calendar Date With Updated Closing Time */}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    position={"relative"}
                    bgcolor={"#b52d2d"}
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                  >
                    {" "}
                    Closing Time
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      bgcolor={"#b52d2d"}
                      position={"absolute"}
                      bottom={0}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {getCompetitorsPrice?.closing ? (
                        moment(getCompetitorsPrice?.closing).format(
                          "Do MMM, HH:mm"
                        )
                      ) : (
                        <span class="Smallloader"></span>
                      )}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </>

      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12} className="">
          <Card className="">
            <Card.Header className=" my-cardd card-header ">
              <h4 className="card-title">  {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
                Competitors Stats</h4>
            </Card.Header>
            <Card.Body className="my-cardd card-body pb-0 overflow-auto">
              <table className="w-100 mb-6">
                <tbody>
                  <tr>
                    <th>
                      <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                        <span>
                          Competitors Name <AiFillCaretDown />
                        </span>
                        <span className="text-end">
                          Fuel <span className="hidden-in-small-screen"> Type
                          </span> <AiFillCaretRight />
                        </span>
                      </span>
                    </th>
                    {Object.keys(data).map((fuelType) => (
                      <th key={fuelType}>
                        <span className="single-Competitor-heading cardd block w-99 ">
                          <BsFuelPumpFill /> {fuelType}
                        </span>
                      </th>
                    ))}
                  </tr>
                  {getCompetitorsPrice?.competitors?.map(
                    (competitorsName, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>

                          <div className="single-Competitor-heading d-flex w-99.9 cardd">
                            <p className=" m-0 d-flex align-items-center">
                              <span>
                                <img src={competitorsName?.supplierImage} alt="supplierImage" className=" mx-3" style={{ width: "36px", height: "36px" }} />
                              </span>
                            </p>

                            <p className=" d-flex flex-column m-0" style={{ minWidth: "55px" }}>
                              <span className="single-Competitor-distance">
                                <AiOutlineArrowRight /> {competitorsName?.station ? "My station" : `${competitorsName?.dist_miles} miles away`}
                              </span>
                              <span style={{ minWidth: "200px", }}>
                                {competitorsName?.name}
                              </span>
                            </p>
                          </div>
                        </td>
                        {Object.keys(data).map((fuelType, colIndex) => (
                          <td key={colIndex}>
                            <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                              <span>
                                <p className=" m-0 single-Competitor-distance"> {data[fuelType]?.[rowIndex]?.last_updated}</p>
                              </span>
                              <span className=" d-flex justify-content-between align-items-center">
                                <span >
                                  {data[fuelType]?.[rowIndex]?.price}
                                </span>

                                {data[fuelType]?.[rowIndex]?.station ? "" : <>
                                  <span className="" style={{ width: "25px", height: "25px", border: "1px solid black", borderRadius: "50%", background: "white", cursor: "pointer", marginLeft: "10px" }} >


                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                          }}
                                        >
                                          Experian Email

                                        </Tooltip>
                                      }
                                    >
                                      <img
                                        alt=""
                                        src={require("../../../assets/images/SingleStatsCompetitor/xpiera-logo.png")}
                                        className="" style={{
                                          // width: "px"
                                          objectFit: "contain"
                                        }}


                                      />
                                    </OverlayTrigger>

                                  </span>
                                </>}


                              </span>
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row >

      <Row
        Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <Card>
            <Card.Header className="card-header">
              <h4 className="card-title"> Local Competitor Stats</h4>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chart">
                <CompetitorSingleGraph
                  getCompetitorsPrice={getCompetitorsPrice}
                  setGetCompetitorsPrice={setGetCompetitorsPrice}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SingleStatsCompetitor;
