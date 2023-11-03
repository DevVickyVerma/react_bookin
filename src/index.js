import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dataReducer, { fetchData } from "./Redux/dataSlice";
import withApi from "./Utils/ApiHelper";
import Loaderimg from "./Utils/Loader";
import SiteEvobossStatus from "./components/pages/EvobossStatus/SiteEvobossStatus";
import SiteEvobossStatusPage from "./components/pages/EvobossStatus/SiteEvobossStatusPage";
import Competitor from "./components/pages/Competitor/Competitor";
import AddCompetitor from "./components/pages/Competitor/AddCompetitor";
import uploadCompetitor from "./components/pages/Competitor/UploadCompititor";
import ValidateOtp from "./components/CustomPages/Login/ValidateOtp";
import StatsCompetitor from "./components/pages/Competitor/StatsCompetitor";
import ManageBank from "./components/pages/ManageBank/ManageBank";
import AddBank from "./components/pages/ManageBank/AddBank";
import EditBank from "./components/pages/ManageBank/EditBank";
import DashBoardChild from "./components/Dashboard/DashboardChild/DashBoardChild";
import DashSubChild from "./components/Dashboard/DashboardSubChild/DashSubChild";
import DashSubChildBaseAPIS from "./components/Dashboard/DashboardSubChild/DashSubChildBaseAPIS";
import CronModule from "./components/pages/CronModule/CronModule";
import SingleStatsCompetitor from "./components/pages/Competitor/SingleStatsCompetitor";

//App
const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));

//Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));

//pages

const EditProfile = React.lazy(() =>
  import("./components/pages/EditProfile/EditProfile")
);
const ManageRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/ManageRoles")
);
const ManageCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/ManageCompany")
);
const AddRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/AddRoles")
);
// client Start
const ManageClient = React.lazy(() =>
  import("./components/pages/ManageClient/ManageClient")
);
const EditClient = React.lazy(() =>
  import("./components/pages/ManageClient/EditClient")
);
const AddClient = React.lazy(() =>
  import("./components/pages/ManageClient/AddClient")
);
// client End
// User Start
const ManageUser = React.lazy(() =>
  import("./components/pages/ManageUsers/ManageUsers")
);
const FAuthentiion = React.lazy(() =>
  import("./components/pages/ManageUsers/2FAUser")
);
const EditUser = React.lazy(() =>
  import("./components/pages/ManageUsers/EditUser")
);
const AddUser = React.lazy(() =>
  import("./components/pages/ManageUsers/AddUser")
);
// User End

// User PPLRate
const ManagePPL = React.lazy(() =>
  import("./components/pages/ManagePPLRate/ManagePPlRate")
);
const EditPPL = React.lazy(() =>
  import("./components/pages/ManagePPLRate/EditPPLRate")
);
const AddPPL = React.lazy(() =>
  import("./components/pages/ManagePPLRate/ManagePPlEAdd")
);
// User PPLRate
// Site Start
const Managesite = React.lazy(() =>
  import("./components/pages/ManageSite/ManageSite")
);
const AddSite = React.lazy(() =>
  import("./components/pages/ManageSite/AddSite")
);

const EditSite = React.lazy(() =>
  import("./components/pages/ManageSite/EditSite")
);

// Site End

// Charges Start

const ManageCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/ManageCharges")
);

const AddCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/AddCharges")
);

const EditCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/EditCharges")
);

// Charges End

// Sage Start

const NominalActivityCodes = React.lazy(() =>
  import("./components/pages/Sage/NominalActivityCodes")
);
const NominalTypes = React.lazy(() =>
  import("./components/pages/Sage/NominalTypes")
);
const NominalTaxCode = React.lazy(() =>
  import("./components/pages/Sage/NominalTaxCode")
);

// Sage End

// Shops Start

const ManageShops = React.lazy(() =>
  import("./components/pages/ManageShops/ManageShops")
);

const AddShops = React.lazy(() =>
  import("./components/pages/ManageShops/AddShops")
);

const EditShops = React.lazy(() =>
  import("./components/pages/ManageShops/EditShops")
);

// Shops End

// Cards Start

const ManageCards = React.lazy(() =>
  import("./components/pages/ManageCards/ManageCards")
);

const AddCards = React.lazy(() =>
  import("./components/pages/ManageCards/AddCards")
);

const EditCards = React.lazy(() =>
  import("./components/pages/ManageCards/EditCards")
);

// Cards End

// Deductions Start

const ManageDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/ManageDeductions")
);

const AddDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/AddDeductions")
);

const EditDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/EditDeductions")
);

// Deductions End

// Suppliers Start

const ManageSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/ManageSuppliers")
);

const AddSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/AddSuppliers")
);

const EditSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/EditSuppliers")
);

// Suppliers End

// Manneger Start

const Assignmanneger = React.lazy(() =>
  import("./components/pages/AssignManneger/Assignmanneger")
);
const AddManneger = React.lazy(() =>
  import("./components/pages/AssignManneger/Addmanneger")
);
const EditManneger = React.lazy(() =>
  import("./components/pages/AssignManneger/EditManager")
);

// const AddSuppliers = React.lazy(() =>
//   import("./components/pages/ManageSuppliers/AddSuppliers")
// );

// const EditSuppliers = React.lazy(() =>
//   import("./components/pages/ManageSuppliers/EditSuppliers")
// );

// Suppliers End

// Pump Start

const ManageSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/ManageSitePump")
);

const AddSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/AddSitePump")
);

const EditSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/EditSitePump")
);
// Pump End

// SiteTank Start

const ManageSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/ManageSiteTank")
);

const AddSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/AddSiteTank")
);

const EditSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/EditSiteTank")
);

// SiteTank End

// SiteNozzle Start

const ManageSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/ManageSiteNozzle")
);

const AddSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/AddSiteNozzle")
);

const EditSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/EditSiteNozzle")
);

// SiteNozzle End
// Items Start

const ManageItems = React.lazy(() =>
  import("./components/pages/ManageItems/ManageItems")
);

const AddItems = React.lazy(() =>
  import("./components/pages/ManageItems/AddItems")
);

const EditItems = React.lazy(() =>
  import("./components/pages/ManageItems/EditItems")
);

// Category Start

const ManageBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/ManageBusinessCategory")
);

const ManageSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/ManageSubBusinessCategory")
);

const AddBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/AddBusinessCategory")
);
const AddSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/AddSubBusinessCategory")
);

const EditBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/EditBusinessCategory")
);

const EditSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/EditSubBusinessCategory")
);
// Category End

// DSR Start

const ManageDsr = React.lazy(() =>
  import("./components/pages/ManageDSR/ManageDsr")
);
const ManageDsrList = React.lazy(() =>
  import("./components/pages/ManageDSR/DsrList")
);
const ManageDsrCrons = React.lazy(() =>
  import("./components/pages/ManageDSR/DsrCrons")
);

// DSR End
// commisons Start

const Managecommission = React.lazy(() =>
  import("./components/pages/ManageComisions/ManageComision")
);
const valetcommission = React.lazy(() =>
  import("./components/pages/ManageComisions/ValetCommission")
);
const Assignaddon = React.lazy(() =>
  import("./components/pages/AddonList/AddonList")
);
const Assignreport = React.lazy(() =>
  import("./components/pages/AssignReports/AssignReports")
);
const AssignUseraddon = React.lazy(() =>
  import("./components/pages/AddonList/UserAddon")
);

// DSR End
// Reports Start

const ManageReports = React.lazy(() =>
  import("./components/pages/Reports/ManageReports")
);

// Reports End
// SiteSettings Start

const SiteSettings = React.lazy(() =>
  import("./components/pages/SiteSetting/SiteSettings")
);

const Tolerances = React.lazy(() =>
  import("./components/pages/SiteSetting/Tolerances")
);

// SiteSettings End
// Other Start

const WorkFlows = React.lazy(() =>
  import("./components/pages/Others/WorkFlow")
);

// Other End
const SkipDates = React.lazy(() =>
  import("./components/pages/SkipDates/SkipDateList")
);
const FUELPRICE = React.lazy(() =>
  import("./components/pages/ManageFuelPrices/FuelPrices")
);
const CompetitorFuelPrices = React.lazy(() =>
  import("./components/pages/ManageFuelPrices/competitorfuelprices")
);
const EditCompetitorFuelPrices = React.lazy(() =>
  import("./components/pages/Competitor/EditCompetitor")
);
const FuelPurchasePrices = React.lazy(() =>
  import("./components/pages/ManageFuelPrices/FuelPurchasePrices")
);
const AddFuelPurchasePrices = React.lazy(() =>
  import("./components/pages/ManageFuelPrices/AddFuelPurchase")
);
const ManageBusinessTypes = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/ManageBusinessTypes")
);
const ManageBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/ManageSubBussiness")
);
const AddBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/AddSubBussiness")
);
const EditBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/EditSubBussiness")
);
const AddBusiness = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/AddBusiness")
);
const ManageAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/ManageAddon")
);
const EditAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/EditAddon")
);
const AddAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/AddAddon")
);

const AddCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/AddCompany")
);

const EditRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/EditRoles")
);

const EditCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/EditCompany")
);
const EditBusiness = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/EditBussinesType")
);

const Settings = React.lazy(() =>
  import("./components/pages/Settings/Settings")
);
const Emaillogs = React.lazy(() =>
  import("./components/pages/Emaillogs/Emaillogs")
);
const Activitylogs = React.lazy(() =>
  import("./components/pages/Emaillogs/ActivityLogs")
);
const FuelPriceslogs = React.lazy(() =>
  import("./components/pages/Emaillogs/FuelPriceLogs")
);
const DailyFacilityFees = React.lazy(() =>
  import("./components/pages/DailyFacilityFees/DailyFacilityFees")
);

const FAQS = React.lazy(() => import("./components/pages/FAQS/FAQS"));

//custom Pages
const Login = React.lazy(() => import("./components/CustomPages/Login/Login"));
const ResetPassword = React.lazy(() =>
  import("./components/CustomPages/ResetPassword/ResetPassword")
);
const Register = React.lazy(() =>
  import("./components/CustomPages/Register/Register")
);
const ForgotPassword = React.lazy(() =>
  import("./components/CustomPages/ForgotPassword/ForgotPassword")
);
const LockScreen = React.lazy(() =>
  import("./components/CustomPages/LockScreen/LockScreen")
);
//Errorpages
const Errorpage400 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/400/400")
);
const UnderConstruction = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/UnderConstruction")
);
const Errorpage401 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/401/401")
);
const Errorpage403 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/403/403")
);
const Errorpage500 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/500/500")
);
const Errorpage503 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/503/503")
);
const COMINGSOON = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/Soon/Comingsoon")
);
const manageNotification = React.lazy(() =>
  import("./layouts/Header/Notifications")
);

const Root = () => {
  const store = configureStore({
    reducer: {
      data: dataReducer,
    },
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const WrappedDashboard = withApi(Dashboard);
  const WrappedManageBusinessSubTypes = withApi(ManageBusinessSubTypes);
  const WrappeAddBusinessSubTypes = withApi(AddBusinessSubTypes);
  const WrappedManageClient = withApi(ManageClient);
  const WrappedAddClient = withApi(AddClient);
  const WrappeAddEditClient = withApi(EditClient);
  const WrappedManageUser = withApi(ManageUser);
  const Wrapped2FAuthentiion = withApi(FAuthentiion);
  const WrappedAddUser = withApi(AddUser);
  const WrappeAddEditUser = withApi(EditUser);
  const WrappedManageSite = withApi(Managesite);
  const WrappedAddSite = withApi(AddSite);
  const WrappeAddEditSite = withApi(EditSite);
  const WrappedManageCompany = withApi(ManageCompany);
  const WrappedAddCompany = withApi(AddCompany);
  const WrappeAddEditCompany = withApi(EditCompany);
  const WrappedManageRoles = withApi(ManageRoles);
  const WrappedAddRoles = withApi(AddRoles);
  const WrappeAddEditRoles = withApi(EditRoles);
  const WrappedManageAddon = withApi(ManageAddon);
  const WrappedAddAddon = withApi(AddAddon);
  const WrappeAddEditAddon = withApi(EditAddon);
  // const WrappeHeader = withApi(Header);
  const WrappedManageCharges = withApi(ManageCharges);
  const WrappedAddCharges = withApi(AddCharges);
  const WrappedEditCharges = withApi(EditCharges);
  const WrappedManageShops = withApi(ManageShops);
  const WrappedAddShops = withApi(AddShops);
  const WrappedSiteEvobossStatus = withApi(SiteEvobossStatus);
  const WrappedSiteEvobossStatusPage = withApi(SiteEvobossStatusPage);
  const WrappedEditShops = withApi(EditShops);
  const WrappedManageCards = withApi(ManageCards);
  const WrappedAddCards = withApi(AddCards);
  const WrappedEditCards = withApi(EditCards);
  const WrappedManageDeductions = withApi(ManageDeductions);
  const WrappedAddDeductions = withApi(AddDeductions);
  const WrappedEditDeductions = withApi(EditDeductions);
  const WrappedManageSuppliers = withApi(ManageSuppliers);
  const WrappedAddSuppliers = withApi(AddSuppliers);
  const WrappedEditSuppliers = withApi(EditSuppliers);

  const WrappedManageBusinessCategory = withApi(ManageBusinessCategory);
  const WrappedManageSubBusinessCategory = withApi(ManageSubBusinessCategory);
  const WrappedAddBusinessCategory = withApi(AddBusinessCategory);
  const WrappedEditBusinessCategory = withApi(EditBusinessCategory);
  const WrappedAddSubBusinessCategory = withApi(AddSubBusinessCategory);
  const WrappedEditSubBusinessCategory = withApi(EditSubBusinessCategory);

  const WrappedManageDsr = withApi(ManageDsr);
  const WrappedManageManageDsrList = withApi(ManageDsrList);
  const WrappedManageManageDsrCrons = withApi(ManageDsrCrons);
  const WrappedManageReports = withApi(ManageReports);
  const WrappedWorkFlows = withApi(WorkFlows);
  const WrappedSiteSettings = withApi(SiteSettings);
  const WrappedTolerances = withApi(Tolerances);

  const WrappedManageSitePump = withApi(ManageSitePump);
  const WrappedAddSitePump = withApi(AddSitePump);
  const WrappedEditSitePump = withApi(EditSitePump);

  const WrappedManageSiteTank = withApi(ManageSiteTank);
  const WrappedAddSiteTank = withApi(AddSiteTank);
  const WrappedEditSiteTank = withApi(EditSiteTank);

  const WrappedManageSiteNozzle = withApi(ManageSiteNozzle);
  const WrappedAddSiteNozzle = withApi(AddSiteNozzle);
  const WrappedEditSiteNozzle = withApi(EditSiteNozzle);

  const WrappedManageItems = withApi(ManageItems);
  const WrappedAddItems = withApi(AddItems);
  const WrappedEditItems = withApi(EditItems);

  const WrappedFUELPRICE = withApi(FUELPRICE);
  const WrappedFuelPurchasePrices = withApi(FuelPurchasePrices);
  const WrappedAddFuelPurchase = withApi(AddFuelPurchasePrices);
  const WrappedAssignmanneger = withApi(Assignmanneger);
  const WrappedAddManneger = withApi(AddManneger);
  const WrappedEditManneger = withApi(EditManneger);
  const WrappedManagecommission = withApi(Managecommission);
  const Wrappedvaletcommission = withApi(valetcommission);
  const WrappedAssignaddon = withApi(Assignaddon);
  const WrappedAssignreport = withApi(Assignreport);
  const WrappedAssignUseraddon = withApi(AssignUseraddon);
  const WrappedAssignManagePPL = withApi(ManagePPL);
  const WrappedAssignEditPPL = withApi(EditPPL);
  const WrappedAssignAddPPL = withApi(AddPPL);
  const WrappedDailyFacilityFees = withApi(DailyFacilityFees);
  const WrappedDashBoardChild = withApi(DashBoardChild);
  const WrappedDashBoardSubChild = withApi(DashSubChild);
  const WrappedDashBoardSiteDetail = withApi(DashSubChildBaseAPIS);
  const WrappedEmaillogs = withApi(Emaillogs);
  const WrappedFuelPriceslogs = withApi(FuelPriceslogs);
  const WrappedCompetitorFuelPrices = withApi(CompetitorFuelPrices);
  const WrappedCompetitor = withApi(Competitor);
  const WrappedAddCompetitor = withApi(AddCompetitor);
  const WrappedStatsCompetitor = withApi(StatsCompetitor);
  const WrappedSingleStatsCompetitor = withApi(SingleStatsCompetitor);

  const WrappeduploadCompetitor = withApi(uploadCompetitor);
  const WrappedManageBank = withApi(ManageBank);
  const WrappedAddBank = withApi(AddBank);
  const WrappedEditBankManneger = withApi(EditBank);

  const WrappedmanageNotification = withApi(manageNotification);
  const WrappedEditCompetitorFuelPrices = withApi(EditCompetitorFuelPrices);
  const WrappedSkipDates = withApi(SkipDates);
  const WrappedCronModule = withApi(CronModule);
  const WrappedNominalActivityCodes = withApi(NominalActivityCodes);
  const WrappedNominalTypes = withApi(NominalTypes);
  const WrappedNominalTaxCode = withApi(NominalTaxCode);
  const WrappedActivitylogs = withApi(Activitylogs);

  return (
    <Fragment>
      <BrowserRouter>
        <React.Suspense fallback={<Loaderimg />}>
          <Provider store={store}>
            <Routes>
              <Route element={<PrivateRoutes token={token} />}>
                <Route path={`/`} element={<App />}>
                  <Route index element={<Dashboard />} />
                  <Route path={`/dashboard`} element={<WrappedDashboard />} />
                  {/* client  Components Start */}
                  <Route path={`/clients`} element={<WrappedManageClient />} />
                  <Route
                    path={`editclient/:id`}
                    element={<WrappeAddEditClient />}
                  />
                  <Route path={`addclient`} element={<WrappedAddClient />} />

                  {/* client  Components End */}

                  {/* User  Components Start */}
                  <Route path={`/users`} element={<WrappedManageUser />} />
                  <Route
                    path={`/2FA-authentication`}
                    element={<Wrapped2FAuthentiion />}
                  />
                  <Route
                    path={`/editusers/:id`}
                    element={<WrappeAddEditUser />}
                  />

                  <Route path={`addusers`} element={<WrappedAddUser />} />

                  <Route path={`/competitor`} element={<WrappedCompetitor />} />
                  <Route
                    path={`/addCompetitor`}
                    element={<WrappedAddCompetitor />}
                  />
                  <Route
                    path={`/competitorstats`}
                    element={<WrappedStatsCompetitor />}
                  />
                  <Route
                    path={`/sitecompetitor/:id`}
                    element={<WrappedSingleStatsCompetitor />}
                  />
                  <Route
                    path={`/uploadCompetitor-price`}
                    element={<WrappeduploadCompetitor />}
                  />

                  {/* User  Components End */}

                  {/* sites  Components Start */}

                  <Route path={`addsite`} element={<WrappedAddSite />} />
                  <Route
                    path={`editsite/:id`}
                    element={<WrappeAddEditSite />}
                  />
                  <Route
                    path={`/site-setting/:id`}
                    element={<WrappedSiteSettings />}
                  />

                  <Route path={`/sites`} element={<Managesite />} />
                  <Route
                    path={`/managebank/:id`}
                    element={<WrappedManageBank />}
                  />
                  <Route path={`/addbank/:id`} element={<WrappedAddBank />} />
                  <Route
                    path={`/editbankmanager/:id`}
                    element={<WrappedEditBankManneger />}
                  />
                  <Route
                    path={`/dailyfacilityfees`}
                    element={<WrappedDailyFacilityFees />}
                  />
                  {/* sites  Components End */}

                  {/* Company  Components Start */}
                  <Route path={`/addcompany`} element={<WrappedAddCompany />} />
                  <Route
                    path={`/managecompany`}
                    element={<WrappedManageCompany />}
                  />
                  <Route
                    path={`/editcompany`}
                    element={<WrappeAddEditCompany />}
                  />

                  {/* Company  Components End */}

                  {/* Role  Components Start */}
                  <Route path={`/roles`} element={<WrappedManageRoles />} />
                  <Route path={`/addroles`} element={<WrappedAddRoles />} />

                  <Route
                    path={`/editrole/:id`}
                    element={<WrappeAddEditRoles />}
                  />

                  {/* Role  Components End */}
                  <Route
                    path={`/assignclientaddon/:id`}
                    element={<WrappedAssignaddon />}
                  />
                  <Route
                    path={`/assignreport/:id`}
                    element={<WrappedAssignreport />}
                  />
                  <Route
                    path={`/assigusernaddon/:id`}
                    element={<WrappedAssignUseraddon />}
                  />
                  {/* Role  Components Start */}

                  <Route
                    path={`/assignmanger/:id`}
                    element={<WrappedAssignmanneger />}
                  />
                  <Route
                    path={`/addmanager/:id`}
                    element={<WrappedAddManneger />}
                  />
                  <Route
                    path={`/editmanager/:id`}
                    element={<WrappedEditManneger />}
                  />

                  {/* Role  Components End */}

                  {/* Addon  Components Start */}
                  <Route
                    path={`/manageaddon`}
                    element={<WrappedManageAddon />}
                  />

                  <Route path={`/addaddon`} element={<WrappedAddAddon />} />
                  <Route
                    path={`EditAddon/:id`}
                    element={<WrappeAddEditAddon />}
                  />

                  {/* Addon  Components End */}
                  <Route path={`/email-logs`} element={<WrappedEmaillogs />} />
                  <Route
                    path={`/fuel-price-logs`}
                    element={<WrappedFuelPriceslogs />}
                  />
                  <Route
                    path={`/activity-logs`}
                    element={<WrappedActivitylogs />}
                  />
                  {/* Header  Components Start */}
                  {/* <Route
                    path={`/advancedElements/headers`}
                    element={<WrappeHeader />}
                  /> */}
                  {/* Header  Components End */}
                  {/* Header  Components Start */}
                  <Route
                    path={`/Managecommission`}
                    element={<WrappedManagecommission />}
                  />
                  <Route
                    path={`/valetcommission`}
                    element={<Wrappedvaletcommission />}
                  />
                  {/* Header  Components End */}

                  {/* DSR  Components Start */}
                  <Route path={`/data-entry`} element={<WrappedManageDsr />} />
                  <Route
                    path={`/dsr-exception`}
                    element={<WrappedManageManageDsrList />}
                  />
                  <Route
                    path={`/drs-api-logs`}
                    element={<WrappedManageManageDsrCrons />}
                  />
                  {/* DSR  Components End */}

                  {/* Others  Components Start */}
                  <Route path={`/workflows`} element={<WrappedWorkFlows />} />
                  {/* Others  Components End */}

                  {/* Reports  Components Start */}
                  <Route path={`/reports`} element={<WrappedManageReports />} />
                  {/* Reports  Components End */}
                  {/* Reports  Components Start */}

                  <Route path={`/tolerances`} element={<WrappedTolerances />} />
                  {/* Reports  Components End */}
                  {/* Charges  Components Start  */}
                  <Route
                    path={`/managecharges`}
                    element={<WrappedManageCharges />}
                  />

                  <Route path={`/addcharges`} element={<WrappedAddCharges />} />
                  <Route
                    path={`/editcharges/:id`}
                    element={<WrappedEditCharges />}
                  />

                  {/* Charges  Components End  */}

                  {/* Shops components start */}

                  <Route
                    path={`/manageshops`}
                    element={<WrappedManageShops />}
                  />

                  <Route path={`/addshops`} element={<WrappedAddShops />} />
                  <Route
                    path={`/site-evobos-status`}
                    element={<WrappedSiteEvobossStatus />}
                  />
                  <Route
                    path="/site-evobos-status/:siteName"
                    element={<WrappedSiteEvobossStatusPage />}
                  />

                  <Route
                    path={`/editshops/:id`}
                    element={<WrappedEditShops />}
                  />

                  {/* Shops components end */}

                  {/* Cards components start */}

                  <Route
                    path={`/managecards`}
                    element={<WrappedManageCards />}
                  />

                  <Route path={`/addcards`} element={<WrappedAddCards />} />
                  <Route
                    path={`/editcard/:id`}
                    element={<WrappedEditCards />}
                  />

                  {/* Cards components end */}

                  {/* Deductions components start */}

                  <Route
                    path={`/managedeductions`}
                    element={<WrappedManageDeductions />}
                  />

                  <Route
                    path={`/adddeductions`}
                    element={<WrappedAddDeductions />}
                  />
                  <Route
                    path={`/editdeductions/:id`}
                    element={<WrappedEditDeductions />}
                  />
                  <Route
                    path={`/notifications`}
                    element={<WrappedmanageNotification />}
                  />

                  {/* Deduction components end */}

                  {/* Suppliers components start */}

                  <Route
                    path={`/managesuppliers`}
                    element={<WrappedManageSuppliers />}
                  />

                  <Route
                    path={`/addsuppliers`}
                    element={<WrappedAddSuppliers />}
                  />
                  <Route
                    path={`/editsuppliers/:id`}
                    element={<WrappedEditSuppliers />}
                  />

                  {/* Suppliers components end */}

                  {/* SitePump components start */}

                  <Route path={`/fuelprice`} element={<WrappedFUELPRICE />} />
                  <Route
                    path={`/competitor-fuel-price`}
                    element={<WrappedCompetitorFuelPrices />}
                  />

                  <Route
                    path={`/fuel-purchase-prices`}
                    element={<WrappedFuelPurchasePrices />}
                  />
                  <Route
                    path={`/Add-purchase-prices`}
                    element={<WrappedAddFuelPurchase />}
                  />
                  <Route
                    path={`/managesitepump`}
                    element={<WrappedManageSitePump />}
                  />

                  <Route
                    path={`/addsitepump`}
                    element={<WrappedAddSitePump />}
                  />
                  <Route
                    path={`/editsitepump/:id`}
                    element={<WrappedEditSitePump />}
                  />

                  <Route
                    path={`/assignppl`}
                    element={<WrappedAssignManagePPL />}
                  />
                  <Route path={`/addppl`} element={<WrappedAssignAddPPL />} />
                  <Route
                    path={`/editppl/:id`}
                    element={<WrappedAssignEditPPL />}
                  />

                  {/* SitePump components end */}

                  {/* SiteTank components start */}

                  <Route
                    path={`/managesitetank`}
                    element={<WrappedManageSiteTank />}
                  />

                  <Route
                    path={`/addsitetank`}
                    element={<WrappedAddSiteTank />}
                  />
                  <Route
                    path={`/editsitetank/:id`}
                    element={<WrappedEditSiteTank />}
                  />

                  {/* SiteTank components end */}

                  {/* SiteNozzle components start */}

                  <Route
                    path={`/managesitenozzle`}
                    element={<WrappedManageSiteNozzle />}
                  />

                  <Route
                    path={`/addsitenozzle`}
                    element={<WrappedAddSiteNozzle />}
                  />
                  <Route
                    path={`/editsitenozzle/:id`}
                    element={<WrappedEditSiteNozzle />}
                  />

                  {/* SiteNozzle components end */}

                  {/* Items components start */}

                  <Route
                    path={`/manageitems`}
                    element={<WrappedManageItems />}
                  />

                  <Route path={`/additems`} element={<WrappedAddItems />} />
                  <Route
                    path={`/edititems/:id`}
                    element={<WrappedEditItems />}
                  />
                  <Route
                    path={`/edit-competitor/:id`}
                    element={<WrappedEditCompetitorFuelPrices />}
                  />

                  {/* Import Types components end */}

                  {/* <Route
                    path={`/manageimporttypes`}
                    element={<WrappedManageImportTypes />}
                  />

                  <Route
                    path={`/addimporttypes`}
                    element={<WrappedAddImportTypes />}
                  />
                  <Route
                    path={`/editimporttypes/:id`}
                    element={<WrappedEditImportTypes />}
                  /> */}

                  {/* Import Types components end */}

                  {/* Category components start */}

                  <Route
                    path={`/managebusinesscategory`}
                    element={<WrappedManageBusinessCategory />}
                  />

                  <Route
                    path={`/managesubbusinesscategory`}
                    element={<WrappedManageSubBusinessCategory />}
                  />

                  <Route
                    path={`/addbusinesscategory`}
                    element={<WrappedAddBusinessCategory />}
                  />

                  <Route
                    path={`/dashboard-details`}
                    element={<WrappedDashBoardChild />}
                  />
                  <Route
                    path={`/dashboardSubChild`}
                    element={<WrappedDashBoardSubChild />}
                  />
                  <Route
                    path={`/dashboard-details/:id`}
                    element={<WrappedDashBoardSiteDetail />}
                  />

                  <Route
                    path={`/addsubbusinesscategory`}
                    element={<WrappedAddSubBusinessCategory />}
                  />

                  <Route
                    path={`/editbusinesscategory/:id`}
                    element={<WrappedEditBusinessCategory />}
                  />
                  <Route
                    path={`/editsubbusinesscategory/:id`}
                    element={<WrappedEditSubBusinessCategory />}
                  />

                  {/* Category components end */}
                  <Route
                    path={`/skipdates/:id`}
                    element={<WrappedSkipDates />}
                  />

                  <Route
                    path={`/cron-module`}
                    element={<WrappedCronModule />}
                  />

                  <Route
                    path={`/nominal-activity-codes`}
                    element={<WrappedNominalActivityCodes />}
                  />
                  <Route
                    path={`/nominal-types`}
                    element={<WrappedNominalTypes />}
                  />
                  <Route
                    path={`/nominal-tax-code`}
                    element={<WrappedNominalTaxCode />}
                  />

                  <Route>
                    <Route path={`/editprofile`} element={<EditProfile />} />

                    <Route
                      path={`/business`}
                      element={<ManageBusinessTypes />}
                    />
                    <Route path={`/comingsoon`} element={<COMINGSOON />} />
                    <Route
                      path={`/sub-business`}
                      element={<WrappedManageBusinessSubTypes />}
                    />
                    <Route
                      path={`/addsub-business`}
                      element={<WrappeAddBusinessSubTypes />}
                    />
                    <Route
                      path={`/editsub-business/:id`}
                      element={<EditBusinessSubTypes />}
                    />
                    <Route path={`/addbusiness`} element={<AddBusiness />} />

                    <Route
                      path={`/editbusiness/:id`}
                      element={<EditBusiness />}
                    />

                    <Route path={`/settings`} element={<Settings />} />

                    <Route path={`/pages/faqs`} element={<FAQS />} />
                  </Route>
                </Route>
              </Route>

              <Route path={`/`} element={<Custompages />}>
                <Route path="/login" element={<Login token={token} />} />

                <Route
                  path="/validateOtp"
                  element={<ValidateOtp token={token} />}
                />

                <Route
                  path={`/reset-password/:token`}
                  element={<ResetPassword />}
                />
                <Route path={`/custompages/register`} element={<Register />} />
                <Route
                  path={`/custompages/forgotPassword`}
                  element={<ForgotPassword />}
                />
                <Route
                  path={`/custompages/lockScreen`}
                  element={<LockScreen />}
                />
                <Route
                  path={`/custompages/errorpages/errorpage401`}
                  element={<Errorpage401 />}
                />
                <Route path={`/errorpage403`} element={<Errorpage403 />} />
                <Route
                  path={`/custompages/errorpages/errorpage500`}
                  element={<Errorpage500 />}
                />

                <Route
                  path={`/custompages/errorpages/errorpage503`}
                  element={<Errorpage503 />}
                />
                <Route
                  path={`/under-construction`}
                  element={<UnderConstruction />}
                />
                <Route path="*" element={<Errorpage400 />} />
              </Route>
              <Route path="/login" element={<Login token={token} />} />
            </Routes>
          </Provider>
        </React.Suspense>
      </BrowserRouter>
    </Fragment>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
