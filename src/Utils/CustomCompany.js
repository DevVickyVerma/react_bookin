import React from 'react'
import { Col } from 'react-bootstrap';

const CustomCompany = ({ formik, lg, md, CompanyList, setSelectedCompanyId, setSiteList, selectedClientId, GetSiteList }) => {
    return (
        <>
            <Col Col lg={lg} md={md}>
                <div className="form-group">
                    <label htmlFor="company_id" className="form-label mt-4">
                        Company
                        <span className="text-danger">*</span>
                    </label>
                    <select
                        className={`input101 ${formik.errors.company_id &&
                            formik.touched.company_id
                            ? "is-invalid"
                            : ""
                            }`}
                        id="company_id"
                        name="company_id"
                        value={formik.values.company_id}
                        onChange={(e) => {
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                                GetSiteList(selectcompany);
                                setSelectedCompanyId(selectcompany);
                                formik.setFieldValue("site_id", "");
                                formik.setFieldValue("company_id", selectcompany);
                            } else {
                                formik.setFieldValue("site_id", "");
                                formik.setFieldValue("company_id", "");

                                setSiteList([]);
                            }
                        }}
                    >
                        <option value="">Select a Company</option>
                        {selectedClientId && CompanyList.length > 0 ? (
                            <>
                                setSelectedCompanyId([])
                                {CompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.company_name}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option disabled>No Company</option>
                        )}
                    </select>
                    {formik.errors.company_id &&
                        formik.touched.company_id && (
                            <div className="invalid-feedback">
                                {formik.errors.company_id}
                            </div>
                        )}
                </div>
            </Col>
        </>
    )
}

export default CustomCompany