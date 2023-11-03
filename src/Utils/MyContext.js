import React, { createContext, useContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [searchdata, setSearchdata] = useState({});
  const [getSiteDetailsLoading, setGetSiteDetailsLoading] = useState(false)
  const [shouldNavigateToDetailsPage, setShouldNavigateToDetailsPage] = useState(false);
  const [getGradsSiteDetails, setGradsGetSiteDetails] = useState(null);
  const [dashboardShopSaleData, setDashboardShopSaleData] = useState(null);
  const [DashboardGradsLoading, setDashboardGradsLoading] = useState(false);
  const [DashboardSiteDetailsLoading, setDashboardSiteDetailsLoading] = useState(false);
  const [dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading] = useState(false);
  // workflow Timer
  const [timeLeft, setTimeLeft] = useState(JSON.parse(
    localStorage.getItem("timeLeft")
  ));
  const [isTimerRunning, setIsTimerRunning] = useState(JSON.parse(
    localStorage.getItem("isTimerRunning")
  ));

  // Value object to provide to consumers
  const value = {
    searchdata,
    setSearchdata,
    getSiteDetailsLoading,
    setGetSiteDetailsLoading,
    shouldNavigateToDetailsPage, setShouldNavigateToDetailsPage,
    getGradsSiteDetails, setGradsGetSiteDetails,
    dashboardShopSaleData, setDashboardShopSaleData,
    DashboardGradsLoading, setDashboardGradsLoading,
    DashboardSiteDetailsLoading, setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading,
    timeLeft, setTimeLeft,
    isTimerRunning, setIsTimerRunning,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Custom hook to access the context
const useMyContext = () => {
  return useContext(MyContext);
};

export { MyProvider, useMyContext };
