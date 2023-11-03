import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as loderdata from "../../data/Component/loderdata/loderdata";

import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../Utils/Loader";
import SingleAuthModal from "../../data/Modal/SingleAuthModal";
import { SuccessAlert } from "../../Utils/ToastUtils";

const Header = (props) => {
  const { isLoading, getData } = props;
  const [isTwoFactorPermissionAvailable, setIsTwoFactorPermissionAvailable] =
    useState(null);

  const [username, setUsername] = useState();
  const [headingusername, setHeadingUsername] = useState();
  const [usernotification, setnotification] = useState();
  const [ShowTruw, setShowTruw] = useState(false);

  const logout = async (row) => {
    try {
      const response = await getData("/logout");

      if (response.data.api_response === "success") {
        localStorage.clear();

        setTimeout(() => {
          window.location.replace("/");
        }, 500);

        SuccessAlert(response.data.message);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  const [twoFactorKey, setTwoFactorKey] = useState(
    localStorage.getItem("two_factor")
  );
  const storedKeyRef = useRef(localStorage.getItem("two_factor"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedKey = localStorage.getItem("two_factor");
      storedKeyRef.current = storedKey;
      if (storedKey !== twoFactorKey) {
        setTwoFactorKey(storedKey);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [twoFactorKey]);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
      setUsername(UserPermissions.full_name);
      setHeadingUsername(UserPermissions.first_name);
    }
  }, [UserPermissions]);

  const isProfileUpdatePermissionAvailable = permissionsArray?.includes(
    "profile-update-profile"
  );
  const isUpdatePasswordPermissionAvailable = permissionsArray?.includes(
    "profile-update-password"
  );
  const isSettingsPermissionAvailable =
    permissionsArray?.includes("config-setting");

  // const isTwoFactorPermissionAvailable = localStorage.getItem("two_factor");

  useEffect(() => {
    const isTwoFactorAvailable = JSON.parse(localStorage.getItem("two_factor"));
    setIsTwoFactorPermissionAvailable(isTwoFactorAvailable);
  }, [isTwoFactorPermissionAvailable]);

  const openCloseSidebar = () => {
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };
  const stringValue = String(UserPermissions?.notifications);

  const handleIconClick = async (row) => {
    try {
      setIsDropdownOpen(!isDropdownOpen);
      const response = await getData("/notifications");

      if (response.data.api_response === "success") {
        setnotification(response?.data?.data);
        // SuccessAlert(response.data.message);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  const navigate = useNavigate();
  const handleViewAllNotificationsClick = () => {
    navigate("/notifications");
    closeDropdown();
  };

  const handleToggleSidebar1 = () => {
    setShowTruw(true);
    // setSidebarVisible1(!sidebarVisible1);
  };
  const [ukDate, setUkDate] = useState("");
  const [ukTime, setUkTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDateTime = new Date();
      const dateOptions = {
        timeZone: "Europe/London",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const timeOptions = {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      const formattedDate = currentDateTime.toLocaleString(
        "en-GB",
        dateOptions
      );
      const formattedTime = currentDateTime.toLocaleString(
        "en-GB",
        timeOptions
      );

      setUkDate(formattedDate);
      setUkTime(formattedTime);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <Navbar expand="md" className="app-header header sticky">
      <Container fluid className="main-container">
        <div className="d-flex align-items-center">
          <Link
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          ></Link>
          <div className="responsive-logo">
            <Link to={`/dashboard/`} className="header-logo">
              <img
                src={require("../../assets/images/brand/logo-3.png")}
                className="mobile-logo logo-1"
                alt="logo"
              />
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="mobile-logo dark-logo-1"
                alt="logo"
              />
            </Link>
          </div>
          <Link className="logo-horizontal " to={`/dashboard/`}>
            <img
              src={require("../../assets/images/brand/logo.png")}
              className="header-brand-img desktop-logo"
              alt="logo"
            />
            <img
              src={require("../../assets/images/brand/logo-3.png")}
              className="header-brand-img light-logo1"
              alt="logo"
            />
          </Link>

          <div className="d-flex order-lg-2 ms-auto header-right-icons">
            <div>
              <Navbar id="navbarSupportedContent-4">
                <div className=" d-flex header-time-section">
                  <span className=" d-flex flex-column uk-text-time">
                    <span style={{ fontWeight: "800" }}>B</span>
                    <span style={{ fontWeight: "800" }}>S</span>
                    <span style={{ fontWeight: "800" }}>T</span>
                  </span>
                  <span className="uk-date-time">
                    {" "}
                    <span>
                      <i
                        className="fa fa-calendar-o"
                        style={{ fontWeight: "800" }}
                      ></i>
                      <span className="uk-time"> {ukDate}</span> <br />
                    </span>
                    <span className="header-time-empty-section"></span>
                    <span>
                      <i
                        className="fa fa-clock-o "
                        style={{ fontWeight: "800" }}
                      ></i>
                      <span className="uk-time">{ukTime}</span>
                    </span>
                  </span>
                </div>

                {storedKeyRef.current === "false" &&
                isProfileUpdatePermissionAvailable ? (
                  <>
                    <span
                      className=""
                      onClick={() => {
                        handleToggleSidebar1();
                      }}
                    >
                      <span className="auth-header-text header-btn">
                        Enable 2FA
                      </span>
                      <span className="auth-header-icon header-icon">
                        <i class="fa fa-shield" aria-hidden="true"></i>
                      </span>
                    </span>
                  </>
                ) : (
                  ""
                )}

                {ShowTruw && localStorage.getItem("two_factor") === "false" ? (
                  <>
                    <SingleAuthModal
                      ShowTruw={ShowTruw}
                      setShowTruw={setShowTruw}
                    />
                  </>
                ) : (
                  ""
                )}

                <Dropdown
                  className="d-md-flex notifications"
                  show={isDropdownOpen}
                  onSelect={(eventKey) => {
                    if (eventKey === "closeDropdown") {
                      closeDropdown();
                    }
                  }}
                  onClick={handleIconClick}
                >
                  <Dropdown.Toggle className="nav-link icon " variant="">
                    <i className="fe fe-bell" />
                    <span className="nav-unread badge bg-danger rounded-pill notifictaion-number  d-flex justify-content-center align-items-center">
                      {stringValue !== undefined ? stringValue : ""}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className=" dropdown-menu-end dropdown-menu-arrow notifications-menu-width "
                    style={{ margin: 0 }}
                  >
                    <div className="drop-heading border-bottom">
                      <div className="d-flex">
                        <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                          You have Notifications
                        </h6>
                        <div className="ms-auto">
                          <span className="badge bg-danger rounded-pill">
                            {stringValue !== undefined ? stringValue : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="notifications-menu 
                    "
                    >
                      <>
                        {isLoading ? <Loaderimg /> : null}
                        {usernotification &&
                          usernotification.notifications
                            ?.slice(0, 3)
                            .map((notification) => (
                              <Dropdown.Item className="d-flex">
                                <div className="notifyimg bg-primary-gradient brround box-shadow-primary">
                                  <i className="fe fe-message-square"></i>
                                </div>

                                <Link to="/Notifications" className="mt-1">
                                  <h5 className="notification-label mb-1">
                                    {notification?.message}
                                  </h5>
                                  <span className="notification-subtext">
                                    {notification?.ago}
                                  </span>
                                </Link>
                              </Dropdown.Item>
                            ))}
                      </>
                    </div>
                    <div className="dropdown-divider m-0"></div>
                    {usernotification &&
                    usernotification?.notifications?.length > 0 ? (
                      <Dropdown.Item
                        eventKey="closeDropdown"
                        onClick={handleViewAllNotificationsClick}
                        className="dropdown-item text-center p-3 text-muted"
                      >
                        View all Notification
                      </Dropdown.Item>
                    ) : (
                      ""
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex order-lg-2">
                  <Dropdown className=" d-md-flex profile-1">
                    <Dropdown.Toggle
                      className="nav-link profile profile-box leading-none d-flex px-1"
                      variant=""
                    >
                      <h5 className="header-name mb-0 d-flex">
                        <span className="header-welcome-text">
                          {`Welcome,  ${" "}`}&nbsp;
                        </span>
                        <span className="header-welcome-text-title">
                          {headingusername ? headingusername : " Admin"}
                        </span>
                      </h5>
                      <i className="fa fa-chevron-circle-down  ms-2"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading">
                        <div className="text-center">
                          <h5 className="text-dark mb-0">
                            {username ? username : "Admin"} <br />{" "}
                          </h5>
                        </div>
                      </div>
                      <div className="dropdown-divider m-0"></div>

                      {isProfileUpdatePermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/editprofile">
                          <i className="dropdown-icon fe fe-user"></i> Edit
                          Profile
                        </Dropdown.Item>
                      ) : null}
                      {isUpdatePasswordPermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/editprofile">
                          <i className="dropdown-icon fa fa-key"></i>Change
                          Password
                        </Dropdown.Item>
                      ) : null}
                      {isSettingsPermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/settings">
                          <i className="dropdown-icon fe fe-settings"></i>
                          Settings
                        </Dropdown.Item>
                      ) : null}

                      <Dropdown.Item onClick={logout}>
                        <i className="dropdown-icon fe fe-alert-circle"></i>
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <ToastContainer />
                </div>
              </Navbar>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default withApi(Header);
