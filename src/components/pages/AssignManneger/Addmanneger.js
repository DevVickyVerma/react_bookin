import React, { useEffect, useState } from "react";
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@material-ui/core";

const AddCompany = (props) => {
  const { isLoading, getData, postData } = props;
  const [dropdownValue, setDropdownValue] = useState([]);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  const [selectedSiteList1, setSelectedSiteList1] = useState([]);
  const { id } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/site/manager/${id}`);

      if (response && response.data) {
        // setData(response.data.data.roles);
        setDropdownValue(response.data.data);
        setSelectedSiteList1(response.data.data.reports);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  const [selectedItems1, setSelectedItems1] = useState([]);

  const handleItemClick1 = (event) => {
    setSelectedItems1(event.target.value);

    const selectedSiteNames = event.target.value;
    const filteredSites = selectedSiteList1.filter((item) =>
      selectedSiteNames.includes(item.report_name)
    );

    formik.setFieldValue("sites", filteredSites);
  };

  const handleSubmit = async (event, values) => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("user_id", formik.values.client_id);
      formData.append("site_id", id);

      formik.values.sites.forEach((site, index) => {
        formData.append(`reports[${index}]`, site.id);
      });

      const postDataUrl = "/site/manager/assign";
      const navigatePath = `/assignmanger/${id}`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };
  const validationSchema = Yup.object({
    client_id: Yup.string().required("Client ID is required"),
  });
  const formik = useFormik({
    initialValues: {
      client_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Assign Site Manager</h1>

              <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{ to: "/dashboard" }}
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item  breadcrumds"
                  aria-current="page"
                  linkAs={Link}
                  linkProps={{ to: "/sites" }}
                >
                  Manage Site Manager
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Assign Site Manager
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Assign User</Card.Title>
                </Card.Header>

                <form onSubmit={(event) => formik.handleSubmit(event)}>
                  <Card.Body>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className=" form-label mt-4"
                          >
                            User<span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            onChange={formik.handleChange}
                          >
                            <option value=""> Select User</option>
                            {dropdownValue.users &&
                              dropdownValue.users.length > 0 ? (
                              dropdownValue.users.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.user_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No User</option>
                            )}
                          </select>
                          {formik.errors.client_id &&
                            formik.touched.client_id && (
                              <div className="invalid-feedback">
                                {formik.errors.client_id}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={3} md={6}>
                        <div className="form-group">
                          <FormControl className="width mt-4">
                            <InputLabel>Select Reports</InputLabel>
                            <Select
                              multiple
                              value={selectedItems1}
                              onChange={handleItemClick1}
                              renderValue={(selected) => selected.join(", ")}
                            >
                              {selectedSiteList1.map((item) => (
                                <MenuItem
                                  key={item.report_name}
                                  value={item.report_name}
                                >
                                  <Checkbox
                                    checked={selectedItems1.includes(
                                      item.report_name
                                    )}
                                  />
                                  <ListItemText primary={item.report_name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
