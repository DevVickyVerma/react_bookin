import React from 'react'
import { Col } from 'react-bootstrap';

const CustomSite = ({ formik, lg, md, SiteList, setSelectedSiteId, CompanyList, setSiteId }) => {
    return (
        <>
            <Col lg={lg} md={md}>
                <div className="form-group">
                    <label htmlFor="site_id" className="form-label mt-4">
                        Site Name
                        <span className="text-danger">*</span>
                    </label>
                    <select
                        className={`input101 ${formik.errors.site_id && formik.touched.site_id
                            ? "is-invalid"
                            : ""
                            }`}
                        id="site_id"
                        name="site_id"
                        value={formik.values.site_id}
                        onChange={(e) => {
                            const selectedsite_id = e.target.value;
                            setSelectedSiteId(selectedsite_id);
                            formik.setFieldValue("site_id", selectedsite_id);
                            setSiteId(selectedsite_id)
                        }}
                    >
                        <option value="">Select a Site</option>
                        {CompanyList && SiteList.length > 0 ? (
                            SiteList.map((site) => (
                                <option key={site.id} value={site.id}>
                                    {site.site_name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No Site</option>
                        )}
                    </select>
                    {formik.errors.site_id && formik.touched.site_id && (
                        <div className="invalid-feedback">
                            {formik.errors.site_id}
                        </div>
                    )}
                </div>
            </Col>
        </>
    )
}

export default CustomSite