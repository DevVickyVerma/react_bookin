import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { BsCapslock } from "react-icons/bs";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";

export default function Login(props) {
  const [isLoading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.getModifierState("CapsLock")) {
        setCapsLockActive(true);
      } else {
        setCapsLockActive(false);
      }
    });
  }, [localStorage.getItem("token")]);
  if (localStorage.getItem("myKey") === null) {
    if (!localStorage.getItem("refreshed")) {
      localStorage.setItem("refreshed", "true");
      window.location.reload();
    }
  }

  const handleKeyPress = (event) => {
    if (event.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });


  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok && data) {
        localStorage.setItem("token", data?.data?.access_token);
        localStorage.setItem("superiorId", data?.data?.superiorId);
        localStorage.setItem("superiorRole", data?.data?.superiorRole);
        localStorage.setItem("role", data?.data?.role);
        localStorage.setItem("auto_logout", data?.data?.auto_logout);
        localStorage.setItem("authToken", data?.data?.token);

        if (data?.data?.is_verified === true) {
          navigate(data?.data?.route);
        } else {
          if (data?.data?.is_verified === false) {
            // setAuthToken(data?.data?.token)
            navigate("/validateOtp");
          }
        }
        localStorage.setItem("justLoggedIn", true);
        SuccessAlert(data?.message);
        setLoading(false);
      } else {
        ErrorAlert(data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        console.error(error);
        navigate("/under-construction")
        ErrorAlert(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="login-img">
          <div className="page">
            <div className="">
              <div className="container-login100">

                <div className="wrap-login100 p-0">
                  <Card.Body>
                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validationSchema={LoginSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {({ errors, touched }) => (
                        <Form className="login100-form validate-form">
                          <span className="login100-form-title">
                            <img
                              src={require("../../../assets/images/brand/logo.png")}
                              className="header-brand-img"
                              alt=""
                            />
                          </span>

                          <div>
                            <div
                              className="wrap-input100 validate-input"
                              style={{ display: "flex" }}
                            >
                              <Field
                                className={`input100 ${errors.email && touched.email
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                // type="password"
                                type="text"
                                name="email"
                                placeholder="Email"
                                onKeyPress={handleKeyPress}
                              />
                              <span className="focus-input100"></span>

                              <span className="symbol-input100">
                                <i
                                  className="zmdi zmdi-email"
                                  aria-hidden="true"
                                ></i>
                              </span>

                              {capsLockActive ? (
                                <>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    <BsCapslock size={16} />{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}

                              {!capsLockActive ? (
                                <>
                                  <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: "11",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  ></span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>

                            <div
                              style={{ color: "#f82649", marginTop: "0.25rem" }}
                            >
                              <ErrorMessage
                                name="email"
                                // component="div"
                                className="invalid-feedback"
                                style={{ flexDirection: "row", color: "red" }}
                              />
                            </div>
                          </div>
                          <div>
                            <div
                              className="wrap-input100 validate-input"
                              style={{ display: "flex" }}
                            >
                              <Field
                                className={`input100 ${errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                // type="password"
                                type={passwordVisible ? "password" : "text"}
                                name="password"
                                placeholder="Password"
                                onKeyPress={handleKeyPress}
                              />
                              <span className="focus-input100"></span>

                              <span className="symbol-input100">
                                <i
                                  className="zmdi zmdi-lock"
                                  aria-hidden="true"
                                ></i>
                              </span>

                              {capsLockActive ? (
                                <>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    <BsCapslock size={16} />{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}

                              {!capsLockActive ? (
                                <>
                                  <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: "11",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    {passwordVisible ? (
                                      <AiFillEyeInvisible size={18} />
                                    ) : (
                                      <AiFillEye size={18} />
                                    )}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>

                            <div
                              style={{ color: "#f82649", marginTop: "0.25rem" }}
                            >
                              <ErrorMessage
                                name="password"
                                // component="div"
                                className="invalid-feedback"
                                style={{ flexDirection: "row", color: "red" }}
                              />
                            </div>
                          </div>

                          <div className="text-end pt-1">
                            <p className="mb-0">
                              <Link
                                to={`/custompages/forgotPassword/`}
                                className="text-primary ms-1"
                              >
                                Forgot Password?
                              </Link>
                            </p>
                          </div>
                          <div className="container-login100-form-btn">
                            <button
                              type="submit"
                              className="login100-form-btn btn-primary"
                            >
                              Login
                            </button>
                            <ToastContainer />
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                  <Card.Footer className=" text-end p-2 color-white" style={{ background: "linear-gradient(90deg, #000000 0%, #353535 91.71%)", color: "white", fontSize: "12px" }}>
                    <span className=" " style={{ paddingRight: "20px" }}>
                      SECURE WITH {" "}
                      <strong className="  font-weight-bold">
                        2FA
                      </strong>
                      {" "}  <i class="fa fa-shield" aria-hidden="true"></i>
                    </span>
                  </Card.Footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
