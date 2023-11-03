import React from 'react'
import { Col } from 'react-bootstrap';

const CustomClient = ({ formik, lg, md, ClientList, setSelectedClientId, setSiteList, setCompanyList, GetCompanyList }) => {
    return (
        <>
            {localStorage.getItem("superiorRole") !== "Client" && (
                <Col lg={lg} md={md}>
                    <div className="form-group">
                        <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                        >
                            Client
                            <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`input101 ${formik.errors.client_id &&
                                formik.touched.client_id
                                ? "is-invalid"
                                : ""
                                }`}
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={(e) => {
                                const selectedType = e.target.value;

                                if (selectedType) {
                                    GetCompanyList(selectedType);
                                    formik.setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);
                                    setSiteList([]);
                                    formik.setFieldValue("company_id", "");
                                    formik.setFieldValue("site_id", "");
                                } else {
                                    console.log(
                                        selectedType,
                                        "selectedType no values"
                                    );
                                    formik.setFieldValue("client_id", "");
                                    formik.setFieldValue("company_id", "");
                                    formik.setFieldValue("site_id", "");

                                    setSiteList([]);
                                    setCompanyList([]);
                                }
                            }}
                        >
                            <option value="">Select a Client</option>
                            {ClientList.data && ClientList.data.length > 0 ? (
                                ClientList.data.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.client_name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Client</option>
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
            )}
        </>
    )
}

export default CustomClient