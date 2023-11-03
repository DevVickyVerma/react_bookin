import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="login-img">
      <div className="page">
        <div className="">
          <div className="col col-login mx-auto">
            <div className="text-center">
              <img
                src={require("../../../assets/images/brand/logo.png")}
                className="header-brand-img"
                alt=""
              />
            </div>
          </div>
          <div className="container-login100">
            <div className="wrap-login100 p-0">
              <Card.Body>
                <form className="login100-form validate-form">
                  <span className="login100-form-title">Registration</span>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder="User name"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="mdi mdi-account" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder="Email"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-email" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
                      type="password"
                      name="pass"
                      password="true"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                  </div>
                  <label className="custom-control custom-checkbox mt-4">
                    <input type="checkbox" className="custom-control-input" />
                    <span className="custom-control-label">
                      Agree the
                      <Link to={`/pages/terms/`}>terms and policy</Link>
                    </span>
                  </label>
                  <div className="container-login100-form-btn">
                    <Link
                      to={`/dashboard/`}
                      className="login100-form-btn btn-primary"
                    >
                      Register
                    </Link>
                  </div>
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Already have account?
                      <Link
                        to={`/custompages/login`}
                        className="text-primary ms-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-center my-3">
                  <Link to="#" className="social-login  text-center me-4">
                    <i className="fa fa-google"></i>
                  </Link>
                  <Link to="#" className="social-login  text-center me-4">
                    <i className="fa fa-facebook"></i>
                  </Link>
                  <Link to="#" className="social-login  text-center">
                    <i className="fa fa-twitter"></i>
                  </Link>
                </div>
              </Card.Footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
