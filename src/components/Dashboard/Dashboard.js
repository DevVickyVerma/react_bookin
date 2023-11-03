import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import { fetchData } from "../../Redux/dataSlice";
import SortIcon from "@mui/icons-material/Sort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import { Box } from "@material-ui/core";
import { useMyContext } from "../../Utils/MyContext";
import StackedLineBarChart from "./StackedLineBarChart";
import DashboardOverallStatsPieChart from "./DashboardOverallStatsPieChart";
import CenterAuthModal from "../../data/Modal/CenterAuthModal";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import CenterFilterModal from "../../data/Modal/CenterFilterModal";
import { ErrorAlert, SuccessAlert } from "../../Utils/ToastUtils";
import DashboardStatsBox from "./DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../Utils/CustomReducer";

const Dashboard = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [ShowTruw, setShowTruw] = useState(true);
  const [ShowAuth, setShowAuth] = useState(false);
  const [ClientID, setClientID] = useState();
  const [SearchList, setSearchList] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const { shop_margin, shop_sale, fuel_value, gross_profit_value, gross_volume, gross_margin_value, pie_chart_values, stacked_line_bar_label, stacked_line_bar_data, d_line_chart_option, d_line_chart_values } = reducerState;



  const {
    searchdata,
    setSearchdata,
    shouldNavigateToDetailsPage,
    setShouldNavigateToDetailsPage,
  } = useMyContext();

  let myLocalSearchData = localStorage.getItem("mySearchData")
    ? JSON.parse(localStorage.getItem("mySearchData"))
    : "";

  const superiorRole = localStorage.getItem("superiorRole");
  const role = localStorage.getItem("role");
  const handleFetchSiteData = async () => {
    try {
      const clientId = localStorage.getItem("superiorId");
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const companyId = localStorage.getItem("PresetCompanyID");
      let url = "";
      if (superiorRole === "Administrator") {
        url = "/dashboard/stats";
      } else if (superiorRole === "Client" && role === "Client") {
        url = `/dashboard/stats?client_id=${clientId}`;
      } else if (superiorRole === "Client" && role === "Operator") {
        url = "/dashboard/stats";
      } else if (superiorRole === "Client" && role !== "Client") {
        url = `dashboard/stats?client_id=${clientId}&company_id=${companyId}`;
      }
      const response = await getData(url);
      const { data } = response;

      if (data) {
        reducerDispatch({
          type: "UPDATE_DATA",
          payload: {
            d_line_chart_values: data?.data?.d_line_graph?.series,
            d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
            stacked_line_bar_data: data?.data?.line_graph?.datasets,
            stacked_line_bar_label: data?.data?.line_graph?.labels,
            pie_chart_values: data?.data?.pi_graph,
            gross_margin_value: data?.data?.gross_margin_,
            gross_volume: data?.data?.gross_volume,
            gross_profit_value: data?.data?.gross_profit,
            fuel_value: data?.data?.fuel_sales,
            shop_sale: data?.data?.shop_sales,
            shop_margin: data?.data?.shop_profit,
          }
        });
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };

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

  const token = localStorage.getItem("token");
  const loggedInFlag = localStorage.getItem("justLoggedIn");
  const tokenUpdated = localStorage.getItem("tokenupdate") === "true";
  const Client_login = localStorage.getItem("Client_login") === "true";
  const storedToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  useEffect(() => {
    setClientID(localStorage.getItem("superiorId"));

    if (tokenUpdated) {
      window.location.reload();
      localStorage.setItem("tokenupdate", "false"); // Update the value to string "false"
      // Handle token update logic without page reload
    }

    if (loggedInFlag) {
      setJustLoggedIn(true);
      localStorage.removeItem("justLoggedIn"); // clear the flag
    }

    if (justLoggedIn) {
      setShowAuth(true);
      SuccessAlert("Login Successfully");
      setJustLoggedIn(false);
    }
  }, [ClientID, dispatch, justLoggedIn, token]);

  useEffect(() => {
    if (Client_login) {
      if (tokenUpdated) {
        window.location.reload();
        localStorage.setItem("Client_login", "false"); // Update the value to string "false"
        // Handle token update logic without page reload
      }
    }
  }, [Client_login]);

  const handleToggleSidebar1 = () => {
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };

  const handleFormSubmit = async (values) => {
    setSearchdata(values);

    const clientId =
      values.client_id !== undefined && values.client_id !== ""
        ? values.client_id
        : localStorage.getItem("superiorId");

    if (values.site_id) {
      // If site_id is present, set site_name to its value
      values.site_name = values.site_name || "";
    } else {
      // If site_id is not present, set site_name to an empty string
      values.site_name = "";
    }
    if (values.company_id) {
      // If company_id is present, set site_name to its value
      values.company_name = values.company_name || "";
    } else {
      // If company_id is not present, set company_name to an empty string
      values.company_name = "";
    }

    // Now you can store the updated 'values' object in localStorage
    localStorage.setItem("mySearchData", JSON.stringify(values));

    const companyId =
      values.company_id !== undefined
        ? values.company_id
        : localStorage.getItem("PresetCompanyID");
    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${clientId}&company_id=${companyId}&site_id=${values.site_id}`
          : `dashboard/stats?client_id=${clientId}&company_id=${companyId}&site_id=${values.site_id}`
      );

      const { data } = response;

      if (data) {

        reducerDispatch({
          type: "UPDATE_DATA",
          payload: {
            d_line_chart_values: data?.data?.d_line_graph?.series,
            d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
            stacked_line_bar_data: data?.data?.line_graph?.datasets,
            stacked_line_bar_label: data?.data?.line_graph?.labels,
            pie_chart_values: data?.data?.pi_graph,
            gross_margin_value: data?.data?.gross_margin_,
            gross_volume: data?.data?.gross_volume,
            gross_profit_value: data?.data?.gross_profit,
            fuel_value: data?.data?.fuel_sales,
            shop_sale: data?.data?.shop_sales,
            shop_margin: data?.data?.shop_profit,
          }
        });
      }
    } catch (error) {
      handleError(error);
      setShouldNavigateToDetailsPage(false);
      console.error("API error:", error);
    }
  };

  const [isLoadingState, setIsLoading] = useState(false);
  const ResetForm = async () => {
    myLocalSearchData = "";
    // setIsLoading(true);
    reducerDispatch({
      type: 'RESET_STATE'
    })
    setSearchdata({});
    setTimeout(() => { }, 1000);
    localStorage.removeItem("mySearchData");

    if (superiorRole !== "Administrator") {
      // Assuming handleFetchSiteData is an asynchronous function
      handleFetchSiteData()
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  const learnstate = useSelector((state) => state)

  console.log("learnstate", learnstate);

  useEffect(() => {
    localStorage.setItem(
      "Dashboardsitestats",
      permissionsArray?.includes("dashboard-site-stats")
    );
    if (UserPermissions?.company_id) {
      localStorage.setItem("PresetCompanyID", UserPermissions?.company_id);
      localStorage.setItem("PresetCompanyName", UserPermissions?.company_name);
    } else {
      localStorage.removeItem("PresetCompanyID");
    }
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
    navigate(UserPermissions?.route);
  }, [UserPermissions, permissionsArray]);
  const isStatusPermissionAvailable =
    permissionsArray?.includes("dashboard-view");

  // useEffect(() => {
  //   if (token && storedToken) {
  //     dispatch(fetchData());
  //   }
  // }, [token]);

  useEffect(() => {
    if (isStatusPermissionAvailable && superiorRole !== "Administrator") {
      if (!myLocalSearchData) {
        handleFetchSiteData();
      }
    }
  }, [permissionsArray]);

  useEffect(() => {
    if (myLocalSearchData) {
      handleFormSubmit(myLocalSearchData);
    }
  }, []);

  const isProfileUpdatePermissionAvailable = permissionsArray?.includes(
    "profile-update-profile"
  );

  const isTwoFactorPermissionAvailable = UserPermissions?.two_factor;

  return (
    <>
      {isLoading || isLoadingState ? <Loaderimg /> : null}
      <div>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={["row"]}
          className="center-filter-modal-responsive"
        >
          <Box alignSelf={["center", "flex-start"]} mt={["0px", "33px"]}>
            <h1
              className="page-title dashboard-page-title"
              style={{ alignItems: "center" }}
            >
              Dashboard ({UserPermissions?.dates})
            </h1>
          </Box>

          {localStorage.getItem("superiorRole") === "Client" &&
            localStorage.getItem("role") === "Operator" ? (
            ""
          ) : (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"baseline"}
              my={["0px", "20px"]}
              gap={"5px"}
              mx={["0px", "10px"]}
              flexDirection={"inherit"}
              className="filter-responsive"
            >
              <span
                className="Search-data"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  gap: "5px",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <>
                  <Box
                    display={["none", "none", "flex"]}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    className=" gap-1"
                  >
                    {/* Assuming this code is within a React component */}
                    {Object.entries(searchdata).some(
                      ([key, value]) =>
                        [
                          "client_name",
                          "TOdate",
                          "company_name",
                          "site_name",
                          "fromdate",
                        ].includes(key) &&
                        value != null &&
                        value !== ""
                    ) ? (
                      Object.entries(searchdata).map(([key, value]) => {
                        if (
                          [
                            "client_name",
                            "TOdate",
                            "company_name",
                            "site_name",
                            "fromdate",
                          ].includes(key) &&
                          value != null &&
                          value !== ""
                        ) {
                          const formattedKey = key
                            .toLowerCase()
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ");

                          return (
                            <div key={key} className="badge">
                              <span className="badge-key">{formattedKey}:</span>
                              <span className="badge-value">{value}</span>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : superiorRole === "Client" && role !== "Client" ? (
                      <div className="badge">
                        <span className="badge-key">Company Name:</span>
                        <span className="badge-value">
                          {localStorage.getItem("PresetCompanyName")}
                        </span>
                      </div>
                    ) : null}
                  </Box>
                </>
                {UserPermissions?.applyFilter &&
                  Object.keys(searchdata).length === 0 ? (
                  <div
                    style={{
                      textAlign: "left",
                      margin: " 10px 0",
                      fontSize: "12px",
                      color: "white",
                      background: "#b52d2d",
                      padding: "4px 10px",
                      borderRadius: "7px",
                    }}
                  >
                    *Please apply filter to see the stats
                  </div>
                ) : (
                  ""
                )}
                <Box
                  display={"flex"}
                  ml={"4px"}
                  alignSelf={["flex-start", "center"]}
                >
                  <Link
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      handleToggleSidebar1();
                    }}
                    title="filter"
                    visible={sidebarVisible1}
                    onClose={handleToggleSidebar1}
                    onSubmit={handleFormSubmit}
                    searchListstatus={SearchList}
                  >
                    Filter
                    <span className="ms-2">
                      <SortIcon />
                    </span>
                  </Link>

                  {Object.keys(searchdata).length > 0 ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Reset Filter</Tooltip>}
                    >
                      <Link
                        to="#" // Replace with the appropriate link URL
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => {
                          ResetForm();
                        }}
                      >
                        <RestartAltIcon />
                      </Link>
                    </OverlayTrigger>
                  ) : (
                    ""
                  )}
                </Box>
              </span>
            </Box>
          )}
        </Box>
        <>
          <Box
            display={["flex", "flex", "none"]}
            flexWrap={"wrap"}
            marginBottom={"10px"}
            className=" gap-1"
          >
            {Object.entries(searchdata).some(
              ([key, value]) =>
                [
                  "client_name",
                  "TOdate",
                  "company_name",
                  "site_name",
                  "fromdate",
                ].includes(key) &&
                value != null &&
                value !== ""
            ) ? (
              Object.entries(searchdata).map(([key, value]) => {
                if (
                  [
                    "client_name",
                    "TOdate",
                    "company_name",
                    "site_name",
                    "fromdate",
                  ].includes(key) &&
                  value != null &&
                  value !== ""
                ) {
                  const formattedKey = key
                    .toLowerCase()
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return (
                    <div key={key} className="badge">
                      <span className="badge-key">{formattedKey}:</span>
                      <span className="badge-value">{value}</span>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : superiorRole === "Client" && role !== "Client" ? (
              <div className="badge">
                <span className="badge-key">Company Name:</span>
                <span className="badge-value">
                  {localStorage.getItem("PresetCompanyName")}
                </span>
              </div>
            ) : null}
          </Box>
        </>

        <CenterFilterModal
          onSubmit={handleFormSubmit}
          title="Search"
          visible={sidebarVisible1}
          onClose={handleToggleSidebar1}
          searchListstatus={SearchList}
          centerFilterModalOpen={centerFilterModalOpen}
          setCenterFilterModalOpen={setCenterFilterModalOpen}
        />

        {isProfileUpdatePermissionAvailable &&
          !isTwoFactorPermissionAvailable &&
          ShowAuth ? (
          <>
            <CenterAuthModal title="Auth Modal" />
          </>
        ) : (
          ""
        )}

        <DashboardStatsBox
          GrossVolume={gross_volume}
          shopmargin={shop_margin}
          GrossProfitValue={gross_profit_value}
          GrossMarginValue={gross_margin_value}
          FuelValue={fuel_value}
          shopsale={shop_sale}
          searchdata={searchdata}
          shouldNavigateToDetailsPage={shouldNavigateToDetailsPage}
          setShouldNavigateToDetailsPage={setShouldNavigateToDetailsPage}
        />

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col style={{ width: "60%" }}>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title" style={{ minHeight: "32px" }}>
                  Total Transactions
                </h4>
              </Card.Header>
              <Card.Body className="card-body pb-0 dashboard-chart-height">
                <div id="chart">
                  {stacked_line_bar_data && stacked_line_bar_label ? (
                    <>
                      <StackedLineBarChart
                        stackedLineBarData={stacked_line_bar_data}
                        stackedLineBarLabels={stacked_line_bar_label}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "0.785rem",
                          textAlign: "center",
                          color: "#d63031",
                        }}
                      >
                        Please Apply Filter To Visualize Chart.....
                      </p>
                      <img
                        src={require("../../assets/images/dashboard/noChartFound.png")}
                        alt="MyChartImage"
                        className="all-center-flex disable-chart"
                      />
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title" style={{ minHeight: "32px" }}>
                  Overall Stats
                </h4>
              </Card.Header>
              <Card.Body className="card-body pb-0 dashboard-chart-height">
                <div id="chart">
                  {pie_chart_values ? (
                    <>
                      <DashboardOverallStatsPieChart data={pie_chart_values} />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "0.785rem",
                          textAlign: "center",
                          color: "#d63031",
                        }}
                      >
                        Please Apply Filter To Visualize Chart.....
                      </p>
                      <img
                        src={require("../../assets/images/dashboard/noChartFound.png")}
                        alt="MyChartImage"
                        className="all-center-flex disable-chart"
                      />
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col lg={12} md={12}>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title">Total Transactions</h4>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chart">
                  <DashboardMultiLineChart
                    LinechartValues={d_line_chart_values}
                    LinechartOption={d_line_chart_option}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(Dashboard);
