import React, { useEffect, useReducer, useState } from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DashboardChildTable from "./DashboardChildTable";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";
import { Box } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useSelector } from "react-redux";
import CenterFilterModal from "../../../data/Modal/CenterFilterModal";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import DashboardStatsBox from "../DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../../Utils/CustomReducer";

const DashBoardChild = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [SearchList, setSearchList] = useState(false);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const { shop_margin, shop_sale, fuel_value, gross_profit_value, gross_volume, gross_margin_value } = reducerState;


  const navigate = useNavigate();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const {
    searchdata,
    setSearchdata,
  } = useMyContext();

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };


  let myLocalSearchData = localStorage.getItem("mySearchData") ? JSON.parse(localStorage.getItem("mySearchData")) : "";


  useEffect(() => {
    if (myLocalSearchData) {
      handleFormSubmit(myLocalSearchData)
    }
  }, [])

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessAlert("Invalid access token");
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
  const superiorRole = localStorage.getItem("superiorRole");

  const role = localStorage.getItem("role");



  const handleFormSubmit = async (values) => {
    const clientId =
      (values.client_id !== undefined && values.client_id !== "")
        ? values.client_id
        : localStorage.getItem("superiorId");

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
      console.error("API error:", error);
    }

    if (searchdata?.length > 0) {
      setSearchdata({});
    }
    setSearchdata(values);

    if (values.site_id) {
      // If site_id is present, set site_name to its value
      values.site_name = values.site_name || "";
    } else {
      // If site_id is not present, set site_name to an empty string
      values.site_name = "";
    }

    localStorage.setItem("mySearchData", JSON.stringify(values));

    setSearchdata(localStorage.setItem("mySearchData", JSON.parse(values)));
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={["row",]}
          className="center-filter-modal-responsive"
        >
          <Box alignSelf={["center", "flex-start"]}
            mt={["0px", "33px"]}>
            <h1 className="page-title  dashboard-page-title">
              Dashboard Details ({UserPermissions?.dates})
            </h1>
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
                Dashboard Details
              </Breadcrumb.Item>
            </Breadcrumb>
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
                  <Box display={["none", "none", "flex"]} flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"} className=" gap-1" >
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

                <Box display={"flex"} ml={"4px"} alignSelf={["flex-start", "center"]} >
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
                </Box>

              </span>


            </Box>
          )}
        </Box>
        <>
          <Box display={["flex", "flex", "none"]} flexWrap={"wrap"} marginBottom={"10px"} className=" gap-1" >
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

        <CenterFilterModal
          onSubmit={handleFormSubmit}
          title="Search"
          visible={sidebarVisible1}
          onClose={handleToggleSidebar1}
          searchListstatus={SearchList}
          centerFilterModalOpen={centerFilterModalOpen}
          setCenterFilterModalOpen={setCenterFilterModalOpen}
        />
      </div>

      <Row>
        <DashboardStatsBox
          GrossVolume={gross_volume}
          shopmargin={shop_margin}
          GrossProfitValue={gross_profit_value}
          GrossMarginValue={gross_margin_value}
          FuelValue={fuel_value}
          shopsale={shop_sale}
          searchdata={searchdata}
        />
      </Row>

      <DashboardChildTable searchdata={searchdata} />
    </>
  );
};

export default DashBoardChild;
