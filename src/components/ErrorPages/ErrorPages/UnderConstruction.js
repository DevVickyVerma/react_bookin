import React from "react";
export default function UnderConstruction() {
    return (
        <div className="error-bg w-100 h-100">
            <div className="page">
                <div className="page-content error-page error2" >
                    <div className="container text-center">
                        <div className="error-template">

                            <div>
                                <h4>Site is under maintenance please try again later...........</h4>
                                <img
                                    src={require("../../../assets/images/under-construction/under-constuction.jpg")}
                                    alt="MyChartImage"
                                    className="all-center-flex nodata-image"
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
