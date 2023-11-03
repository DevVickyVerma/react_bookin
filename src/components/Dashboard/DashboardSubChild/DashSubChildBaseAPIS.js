import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMyContext } from "../../../Utils/MyContext";
import { Slide, toast } from "react-toastify";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import DashSubChild from "./DashSubChild";

const DashSubChildBaseAPIS = (props) => {
  const { isLoading, getData } = props;
  const {
    setGradsGetSiteDetails,
    setDashboardShopSaleData,
    setDashboardGradsLoading, setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading
  } = useMyContext();
  const { id } = useParams();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [getSiteStats, setGetSiteStats] = useState(null);
  const [getSiteDetails, setGetSiteDetails] = useState(null);
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
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
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(" ")
        : error.response?.data?.message;
      ErrorAlert(errorMessage);
    }
  }

  const FetchTableData = async () => {
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }
      const response1 = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-stats?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-stats?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );

      if (response1 && response1.data) {
        if (response1?.data?.data?.siteInfo > 0) {
          localStorage.setItem("SiteDetailsModalShow", "true");
        } else {
          localStorage.setItem("SiteDetailsModalShow", "false");
        }
        setGetSiteStats(response1?.data);
      } else {
        throw new Error("No data available in the response");

      }
    } catch (error) {
      handleError(error)
      console.error("API error:", error);
    }

  };


  const FetchGetSiteDetailsApi = async () => {
    setDashboardSiteDetailsLoading(true);
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }
      const response2 = await axiosInstance.get(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );

      if (response2 && response2.data) {
        setGetSiteDetails(response2?.data?.data);
        setDashboardSiteDetailsLoading(false);
      } else {
        setDashboardSiteDetailsLoading(false);
        throw new Error("No data available in the response");
      }
    } catch (error) {
      setDashboardSiteDetailsLoading(false);
      console.error("API error:", error);
      handleError(error)
    }
    setDashboardSiteDetailsLoading(false);
  }
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const [scrollY, setScrollY] = useState(0);
  const [callShopSaleApi, setCallShopSaleApi] = useState(false);
  const [callSiteFuelPerformanceApi, setCallSiteFuelPerformanceApi] = useState(false);


  const FetchShopSaleData = async () => {
    try {
      setDashSubChildShopSaleLoading(true);
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }

      const response2 = await axiosInstance.get(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-shop-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-shop-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );

      if (response2 && response2.data) {
        setDashboardShopSaleData(response2?.data?.data);
        setDashSubChildShopSaleLoading(false);
      } else {
        setDashSubChildShopSaleLoading(false);
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      setDashSubChildShopSaleLoading(false);
      handleError(error)
    } finally {
      setDashSubChildShopSaleLoading(false);
    }
    setDashSubChildShopSaleLoading(false);
  };

  const FetchSiteFuelPerformanceData = async () => {
    setDashboardGradsLoading(true)
    try {
      if (localStorage.getItem("Dashboardsitestats") === "true") {
        try {
          // Attempt to parse JSON data from local storage
          const searchdata = await JSON.parse(
            localStorage.getItem("mySearchData")
          );
          const superiorRole = localStorage.getItem("superiorRole");
          const role = localStorage.getItem("role");
          const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
          let companyId = ""; // Define companyId outside the conditionals

          if (superiorRole === "Client" && role !== "Client") {
            // Set companyId based on conditions
            companyId =
              searchdata?.company_id !== undefined
                ? searchdata.company_id
                : localStoragecompanyId;
          } else {
            companyId =
              searchdata?.company_id !== undefined ? searchdata.company_id : "";
          }

          // Use async/await to fetch data

          const response3 = await axiosInstance.get(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/dashboard/get-site-fuel-performance?site_id=${id}`
              : `/dashboard/get-site-fuel-performance?site_id=${id}`
          );

          if (response3 && response3.data) {
            setGradsGetSiteDetails(response3?.data?.data);
            setDashboardGradsLoading(false);
          } else {
            throw new Error("No data available in the response");
          }
          setDashboardGradsLoading(false);
        } catch (error) {
          // Handle errors that occur during the asynchronous operations
          setDashboardGradsLoading(false);
        }
      }
    } catch (error) {
      setDashboardGradsLoading(false);
      handleError(error)
    }
    setDashboardGradsLoading(false);
  }

  useEffect(() => {
    FetchTableData();
    FetchGetSiteDetailsApi();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Function to update scrollY when scrolling occurs
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      if (currentScrollY > 150 && !callSiteFuelPerformanceApi) {
        setCallSiteFuelPerformanceApi(true);
      }

      if (currentScrollY > 250 && !callShopSaleApi) {
        setCallShopSaleApi(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callShopSaleApi, callSiteFuelPerformanceApi]);

  useEffect(() => {
    if (callShopSaleApi) {
      // Call FetchCompititorData when alertShown becomes true
      FetchShopSaleData();
    }
  }, [callShopSaleApi]);
  useEffect(() => {
    if (callSiteFuelPerformanceApi) {
      // Call FetchCompititorData when alertShown becomes true
      FetchSiteFuelPerformanceData();

    }
  }, [callSiteFuelPerformanceApi]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="overflow-container">
        <DashSubChild
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
          getCompetitorsPrice={getCompetitorsPrice}
          setGetCompetitorsPrice={setGetCompetitorsPrice}
        />
      </div>
    </>
  );
};

export default withApi(DashSubChildBaseAPIS);
