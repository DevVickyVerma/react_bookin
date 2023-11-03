import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import CustomClient from "../../../Utils/CustomClient";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomSite from "../../../Utils/CustomSite";

const AddSitePump = (props) => {
  const { isLoading, getData, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [SiteId, setSiteId] = useState();

  const handleSubmit1 = async (values) => {
    try {
      const tank = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };

      localStorage.setItem("SiteTAnk", JSON.stringify(tank));
      const formData = new FormData();
      formData.append("sales_volume", values.sales_volume);
      formData.append("pence_per_liter", values.pence_per_liter);

      formData.append("site_id", values.site_id);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }
      formData.append("company_id", values.company_id);

      const postDataUrl = "/site-ppl/add";

      const navigatePath = "/assignppl";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const formik = useFormik({
    initialValues: {
      sales_volume: "",
      pence_per_liter: "",
      status: "1",
      site_id: "",
      fuel_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
      sales_volume: Yup.string().required(
        "  Sales Volume is required"
      ),
      pence_per_liter: Yup.string().required(
        " Pence Per Liter is required"
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
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  console.log(formik.values, "formikvalue");

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site PPL Rate</h1>

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
                  Manage Site PPL Rate
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site PPL Rate</Card.Title>
                </Card.Header>

                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>

                      <CustomClient
                        formik={formik}
                        lg={4}
                        md={6}
                        ClientList={ClientList}
                        setSelectedClientId={setSelectedClientId}
                        setSiteList={setSiteList}
                        setCompanyList={setCompanyList}
                        GetCompanyList={GetCompanyList}
                      />

                      <CustomCompany
                        formik={formik}
                        lg={4}
                        md={6}
                        CompanyList={CompanyList}
                        setSelectedCompanyId={setSelectedCompanyId}
                        setSiteList={setSiteList}
                        selectedClientId={selectedClientId}
                        GetSiteList={GetSiteList}
                      />

                      <CustomSite
                        formik={formik}
                        lg={4}
                        md={6}
                        SiteList={SiteList}
                        setSelectedSiteId={setSelectedSiteId}
                        CompanyList={CompanyList}
                        setSiteId={setSiteId}
                      />

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="pence_per_liter"
                          >
                            Pence Per Liter
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.pence_per_liter &&
                              formik.touched.pence_per_liter
                              ? "is-invalid"
                              : ""
                              }`}
                            id="pence_per_liter"
                            name="pence_per_liter"
                            placeholder="Pence Per Liter"
                            onChange={formik.handleChange}
                            value={formik.values.pence_per_liter}
                          />
                          {formik.errors.pence_per_liter && formik.touched.pence_per_liter && (
                            <div className="invalid-feedback">
                              {formik.errors.pence_per_liter}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="sales_volume"
                          >
                            Sales Volume
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="number"
                            autoComplete="off"
                            // className="form-control"
                            className={`input101 ${formik.errors.sales_volume && formik.touched.sales_volume
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sales_volume"
                            name="sales_volume"
                            placeholder=" Sales Volume"
                            onChange={formik.handleChange}
                            value={formik.values.sales_volume}
                          />
                          {formik.errors.sales_volume && formik.touched.sales_volume && (
                            <div className="invalid-feedback">
                              {formik.errors.sales_volume}
                            </div>
                          )}
                        </div>
                      </Col>

                    </Row>
                    <Card.Footer className="text-end">
                      <button className="btn btn-primary me-2" type="submit">
                        Add
                      </button>
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to="/assignppl"
                      >
                        Cancel
                      </Link>
                    </Card.Footer>
                  </form>
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddSitePump);
