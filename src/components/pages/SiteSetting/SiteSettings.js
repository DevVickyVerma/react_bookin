import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import { Field } from "formik";

const SiteSettings = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [BussinesModelData, setBussinesModelData] = useState([]);
  const [CardsModelData, setCardsModelData] = useState([]);
  const [editable, setis_editable] = useState();
  const [fuelData, setFuelData] = useState([]);
  const [DrsData, setDrsData] = useState([]);
  const [SiteItems, setSiteItems] = useState([]);
  const [ReportsData, setReportsData] = useState([]);
  const [CashDayData, setCashDayData] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await getData(`/site/get-setting-list/${id}`);

      if (response && response?.data) {
        const { data } = response;
        setData(data?.data ? data.data.charges : []);
        setDeductionData(data?.data ? data.data.deductions : []);
        setFuelData(data?.data ? data.data.fuels : []);
        setDrsData(data?.data ? data.data.drsCard : []);
        setReportsData(data?.data ? data.data.reports : []);
        setSiteItems(data?.data ? data.data.site_items : []);
        setBussinesModelData(data?.data ? data.data.business_models : []);
        setCardsModelData(data?.data ? data.data.cards : []);
        setCashDayData(data?.data ? data.data.cash_days : []);
        setis_editable(data?.data ? data.data : {});

        formik.setFieldValue(
          "AssignFormikbussiness",
          data?.data?.business_models
        );

        formik.setFieldValue("FormikDeductionData", data?.data?.deductions);
        formik.setFieldValue("Formiksite_items", data?.data?.site_items);
        formik.setFieldValue("FormikChargesData", data?.data?.charges);
        formik.setFieldValue("FormikFuelData", data?.data?.fuels);
        formik.setFieldValue("FormikDRSData", data?.data?.drsCard);
        formik.setFieldValue("FormikreportsData", data?.data?.reports);

        formik.setFieldValue("AssignFormikCards", data?.data?.cards);
        formik.setFieldValue("CahsDayFormikData", data?.data?.cash_days);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSettingSubmit = async (values) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      values.AssignFormikbussiness.forEach((obj) => {
        const { id, business_model_types, checked } = obj;
        const business_models_valueKey = `business_models[${id}]`;

        business_model_types.forEach((model) => {
          const { id: modelId, checked: radiochecked } = model;

          if (radiochecked && checked) {
            formData.append(business_models_valueKey, modelId);
          }
        });
      });

      const selectedFuelIds = [];
      const fuel_models_valueKey = "fuels";

      for (let i = 0; i < values.FormikFuelData.length; i++) {
        const { id, fuel_name, checked } = values.FormikFuelData[i];

        if (checked) {
          selectedFuelIds.push({ [fuel_models_valueKey + "[" + i + "]"]: id });
        }
      }
      selectedFuelIds.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        formData.append(key, value);
      });
      const selectedDrsIds = [];
      const Drs_models_valueKey = "drs_card_id";

      for (let i = 0; i < values.FormikDRSData.length; i++) {
        const { id, fuel_name, checked } = values.FormikDRSData[i];

        if (checked) {
          selectedDrsIds.push({ [Drs_models_valueKey + "[" + i + "]"]: id });
        }
      }

      selectedDrsIds.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        formData.append(key, value);
      });
      const selectedCashDayIds = [];
      const cashday_models_valueKey = "days";

      for (let i = 0; i < values.CahsDayFormikData.length; i++) {
        const { day, checked } = values.CahsDayFormikData[i];

        if (checked) {
          selectedCashDayIds.push({
            [cashday_models_valueKey + "[" + i + "]"]: day,
          });
        }
      }

      selectedCashDayIds.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        formData.append(key, value);
      });
      const selectedReportsIds = [];
      const reports_models_valueKey = "reports";

      for (let i = 0; i < values.FormikreportsData.length; i++) {
        const { id, fuel_name, checked } = values.FormikreportsData[i];

        if (checked) {
          selectedReportsIds.push({
            [reports_models_valueKey + "[" + i + "]"]: id,
          });
        }
      }

      selectedReportsIds.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        formData.append(key, value);
      });

      for (const obj of values.AssignFormikCards) {
        const { id, for_tenant, checked, card_name } = obj;
        const card_valueKey = `cards[${id}]`;
        if (checked) {
          formData.append(card_valueKey, for_tenant);
        }
      }

      for (const obj of values.FormikChargesData) {
        const { id, charge_name, charge_value, checked, admin, operator } = obj;
        const charge_admin_valueKey = `charge_admin[${id}]`;
        const charge_operator_valueKey = `charge_operator[${id}]`;
        const charge_amount_valueKey = `charge_amount[${id}]`;
        const charges = `charges[]`;

        if (checked) {
          formData.append(charges, id);
          formData.append(charge_amount_valueKey, charge_value);
          formData.append(charge_admin_valueKey, admin);
          formData.append(charge_operator_valueKey, operator);
        }
      }
      for (const obj of values.FormikDeductionData) {
        const {
          id,
          deduction_name,
          deduction_value,
          checked,
          admin,
          operator,
        } = obj;
        const deductions_admin_valueKey = `deduction_admin[${id}]`;
        const deductions_operator_valueKey = `deduction_operator[${id}]`;
        const deductions_amount_valueKey = `deduction_amount[${id}]`;
        const deductions = `deductions[]`;

        if (checked) {
          formData.append(deductions, id);
          formData.append(deductions_amount_valueKey, deduction_value);
          formData.append(deductions_admin_valueKey, admin);
          formData.append(deductions_operator_valueKey, operator);
        }
      }

      for (const obj of values.Formiksite_items) {
        const { id, dept_name, price, checked, is_admin } = obj;
        const deductions_admin_valueKey = `department_item_admin[${id}]`;

        const department_items = `department_items[${id}]`;

        if (checked) {
          formData.append(department_items, price);
          formData.append(deductions_admin_valueKey, is_admin);
        }
      }

      formData.append("id", id);

      const postDataUrl = "/site/update-setting";
      const navigatePath = "/sites";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const initialValues = {
    data: data,
    siteItems: SiteItems,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      handleSettingSubmit(values);
    },
    // ... Add other Formik configuration options as needed
  });

  const handleRadioBussinessmodel = (row, index) => {
    const clickedModel = row.business_model_types[index];

    const updatedModels = BussinesModelData.map((item) => {
      if (item.id === row.id) {
        const updatedModelTypes = item.business_model_types.map((model, i) => ({
          ...model,
          checked: i === index,
        }));

        return {
          ...item,
          business_model_types: updatedModelTypes,
        };
      }
      return item;
    });

    formik.setFieldValue("AssignFormikbussiness", updatedModels);
    setBussinesModelData(updatedModels);
  };

  const [selectAllCheckedReports, setSelectAllCheckedReports] = useState(false);

  const [selectAllCheckedDrsCards, setSelectAllCheckedDrsCards] =
    useState(false);

  const handleSelectAllReports = () => {
    const updatedRowData = ReportsData.map((row) => ({
      ...row,
      checked: !selectAllCheckedReports,
    }));
    formik.setFieldValue("FormikreportsData", updatedRowData);
    setSelectAllCheckedReports(!selectAllCheckedReports);

    formik.setFieldValue("FormikreportsData", updatedRowData);
  };
  const handleSelectAllDrsCards = () => {
    const updatedRowData = DrsData.map((row) => ({
      ...row,
      checked: !selectAllCheckedDrsCards,
    }));
    formik.setFieldValue("FormikDRSData", updatedRowData);
    setSelectAllCheckedDrsCards(!selectAllCheckedDrsCards);

    formik.setFieldValue("FormikDRSData", updatedRowData);
  };

  const BussinesModelColumn = [
    {
      name: "Select",

      selector: "checked",
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`AssignFormikbussiness[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.AssignFormikbussiness?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "Business Models",
      selector: "item_name",
      sortable: true,
      width: "45%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.item_name}</h6>
          </div>
        </div>
      ),
    },
  ];

  // Add dynamic columns for business model types
  const businessModels = formik.values.AssignFormikbussiness || [];
  if (businessModels.length > 0) {
    const businessModelTypes = businessModels[0]?.business_model_types || [];
    businessModelTypes.forEach((model, index) => {
      const column = {
        name: model.model_name,
        selector: (row) => row.business_model_types[index]?.id,
        sortable: false,
        center: true,
        width: "15%",
        cell: (row) => (
          <div className="d-flex">
            <div className="ms-auto">
              <input
                type="radio"
                name={`radioButton_${row.id}_${index}`}
                checked={row.business_model_types[index]?.checked}
                onChange={() => handleRadioBussinessmodel(row, index)}
              />
            </div>
          </div>
        ),
      };
      BussinesModelColumn.push(column);
    });
  }

  const CardsModelColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "15%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`AssignFormikCards[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.AssignFormikCards?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Card Model",
      selector: (row) => row.card_name,
      sortable: true,
      width: "85%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.card_name}</h6>
          </div>
        </div>
      ),
    },
  ];

  const chargesColumns = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikChargesData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "CHARGE GROUPS",
      width: "25%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Amount",
      selector: (row) => row.charge_value,
      sortable: false,
      width: "20%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`charge_value-${index}`}
            name={`FormikChargesData[${index}].charge_value`}
            className="table-input"
            value={formik.values?.FormikChargesData?.[index]?.charge_value ?? 0}
            // value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "Admin",

      selector: (row) => row.admin,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].admin`}
            className="table-checkbox-input"
            checked={formik.values?.FormikChargesData?.[index]?.admin ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Operator",

      selector: (row) => row.operator,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].operator`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikChargesData?.[index]?.operator ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];
  const deductionsColumns = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikDeductionData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "CHARGE GROUPS",
      width: "25%",
      selector: (row) => row.deduction_name,
      sortable: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Amount",
      selector: (row) => row.deduction_value,
      sortable: false,
      width: "20%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`deduction_value-${index}`}
            name={`FormikDeductionData[${index}].deduction_value`}
            className="table-input"
            value={
              formik.values?.FormikDeductionData?.[index]?.deduction_value ?? 0
            }
            // value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "Admin",

      selector: (row) => row.admin,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].admin`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikDeductionData?.[index]?.admin ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Operator",

      selector: (row) => row.operator,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].operator`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikDeductionData?.[index]?.operator ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];

  const SiteItemsColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`Formiksite_items[${index}].checked`}
            className="table-checkbox-input"
            checked={formik.values?.Formiksite_items?.[index]?.checked ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "Department Name",
      selector: (row) => row.dept_name,
      sortable: true,
      width: "40%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.dept_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Meter Reading",
      selector: (row) => row.price,
      sortable: false,
      width: "25%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`price-${index}`}
            name={`Formiksite_items[${index}].price`}
            className="table-input"
            value={formik.values?.Formiksite_items?.[index]?.price ?? 0}
            // value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "For Admin",
      selector: "checked",
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`Formiksite_items[${index}].is_admin`}
            className="table-checkbox-input"
            checked={
              formik.values?.Formiksite_items?.[index]?.is_admin ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];

  const FuelsModelColumn = [
    {
      name: "Select",

      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikFuelData[${index}].checked`}
            className="table-checkbox-input"
            checked={formik.values?.FormikFuelData?.[index]?.checked ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Fuel Name",
      selector: (row) => row.fuel_name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.fuel_name}</h6>
          </div>
        </div>
      ),
    },
  ];
  const DRSModelColumn = [
    {
      name: (
        <input
          type="checkbox"
          id="selectAllCheckboxDrsData"
          name="selectAllCheckboxDrsData"
          className="table-checkbox-input"
          checked={selectAllCheckedDrsCards}
          onChange={handleSelectAllDrsCards}
        />
      ),
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDRSData[${index}].checked`}
            className="table-checkbox-input"
            checked={formik.values?.FormikDRSData?.[index]?.checked ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Fuel Name",
      selector: (row) => row.drs_card_name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.drs_card_name}</h6>
          </div>
        </div>
      ),
    },
  ];
  const CashDatModelColumn = [
    {
      name: "Select",
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`CahsDayFormikData[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.CahsDayFormikData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Cash Day",
      selector: (row) => row.day,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.day}</h6>
          </div>
        </div>
      ),
    },
  ];
  const ReportsColumn = [
    {
      name: (
        <input
          type="checkbox"
          id="selectAllCheckboxReports"
          name="selectAllCheckboxReports"
          className="table-checkbox-input"
          checked={selectAllCheckedReports}
          onChange={handleSelectAllReports}
        />
      ),
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikreportsData[${index}].checked`}
            className="table-checkbox-input"
            checked={
              formik.values?.FormikreportsData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Reports",
      selector: (row) => row.report_name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.report_name}</h6>
          </div>
        </div>
      ),
    },
  ];

  // Define an array to store the combined objects

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Site Settings</h1>

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
                Manage Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Site Settings
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <form onSubmit={formik.handleSubmit}>
            <div className=" m-4">
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Business</h3>
                      </Card.Header>

                      {BussinesModelData?.length > 0 ? (
                        <>
                          <div className="module-height">
                            <DataTable
                              columns={BussinesModelColumn}
                              data={BussinesModelData}
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                              responsive
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                            alt="MyChartImage"
                            className="all-center-flex nodata-image"
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={6} md={6}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Card</h3>
                      </Card.Header>
                      {CardsModelData?.length > 0 ? (
                        <>
                          <div className="module-height">
                            <DataTable
                              columns={CardsModelColumn}
                              data={CardsModelData}
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                              responsive
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                            alt="MyChartImage"
                            className="all-center-flex nodata-image"
                          />
                        </>
                      )}
                    </Col>
                    <Col lg={6} md={6}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Cash Day</h3>
                      </Card.Header>

                      {CashDayData?.length > 0 ? (
                        <>
                          <div className="module-height">
                            <DataTable
                              columns={CashDatModelColumn}
                              data={CashDayData}
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                              responsive
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                            alt="MyChartImage"
                            className="all-center-flex nodata-image"
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Charges</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={chargesColumns}
                          data={data}
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Deductions</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={deductionsColumns}
                          data={DeductionData}
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Department Items</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={SiteItemsColumn}
                          data={SiteItems}
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={4} md={4}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Reports</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={ReportsColumn}
                          data={ReportsData}
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                    <Col lg={4} md={4}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Fuels</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={FuelsModelColumn}
                          data={fuelData}
                          //
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                    <Col lg={4} md={4}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign DRS Cards</h3>
                      </Card.Header>
                      <div className="module-height">
                        <DataTable
                          columns={DRSModelColumn}
                          data={DrsData}
                          //
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          </form>
        </Row>
      </>
    </>
  );
};

export default withApi(SiteSettings);
