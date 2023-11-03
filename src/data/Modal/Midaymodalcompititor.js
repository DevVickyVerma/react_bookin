import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, TableContainer } from "@mui/material";
import { Card } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Competitormodal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState(null); // Initialize data as null
  const [isLoading, setIsLoading] = useState(false);
  const [hasListing, setHasListing] = useState(false);

  const navigate = useNavigate();

  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 500,
      theme: "colored",
    });
  };

  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored",
    });
  };

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (selectedItem && selectedDrsDate) {
        const token = localStorage.getItem("token");

        const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        try {
          setIsLoading(true);

          const response = await axiosInstance.get(
            `/site/competitor-price/listing?site_id=${accordionSiteID}&drs_date=${selectedDrsDate}`
          );

          const responseData = response?.data?.data;

          if (responseData?.listing) {
            setHasListing(true);
          } else {
            setHasListing(false);
          }
          setData(responseData);
          if (responseData?.listing) {
            const initialValues = {
              siteId: accordionSiteID,
              siteName: selectedItem.competitorname,
              listing: responseData.listing[0]?.competitors || [],
            };
            formik.setValues(initialValues);
          } else {
            // Set initialValues to an empty object or your preferred default values
            const initialValues = {
              siteId: "",
              siteName: "",
              listing: [],
            };
            formik.setValues(initialValues);
          }

          // Initialize the form with default values
        } catch (error) {
          console.error("API error:", error);
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedItem, selectedDrsDate]);

  const formik = useFormik({
    initialValues: {
      siteId: "",
      siteName: "",
      listing: [],
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    values.listing.forEach((listingItem, listingIndex) => {
      listingItem.fuels.forEach((fuel, fuelIndex) => {
        const siteId = values.siteId;
        const priceId = fuel.id;

        const fieldKey = `fuels[${priceId}]`;
        const timeKey = `time[${siteId}][${priceId}]`;
        const fieldValue = fuel.price.toString();
        const fieldTime = fuel.time || "00:00";

        if (
          fieldValue !== "" &&
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldTime !== "" &&
          fieldTime !== null &&
          fieldTime !== undefined
        ) {
          formData.append(fieldKey, fieldValue);
          // formData.append(timeKey, fieldTime);
        }
      });
    });

    formData.append("drs_date", selectedDrsDate);
    formData.append("site_id", accordionSiteID);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.post(
        "/site/competitor-price/update",
        formData
      );

      if (response.status === 200 && response.data.api_response === "success") {
        sendDataToParent();
        SuccessAlert(response.data.message);
        navigate("/competitor-fuel-price");
        onClose();
      } else {
        // Handle other cases or errors here
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendDataToParent = () => {
    const dataToSend = "Data from child 123";
    onDataFromChild(dataToSend);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="100px"
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <div className="ModalTitle-date">
            <span> {selectedItem?.competitorname}</span>
            <span> ({selectedDrsDate})</span>
          </div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>

        <DialogContent>
          {isLoading ? <Loaderimg /> : null}
          {hasListing ? (
            <TableContainer>
              <div className="table-container table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Competitor</th>

                      {data?.head_array?.map((header, columnIndex) => (
                        <th key={columnIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {formik.values.listing.map(
                      (competitor, competitorIndex) => (
                        <tr key={competitor.id} className="middayModal-tr">
                          <td className="middayModal-td text-muted fs-15 fw-semibold">
                            {competitor.competitor_name}
                          </td>

                          {competitor.fuels.map((fuel, fuelIndex) => (
                            <td key={fuel.id} className="middayModal-td">
                              {!fuel.is_editable ? (
                                <input
                                  className={`table-input`}
                                  type="number"
                                  step="0.010"
                                  name={`listing[${competitorIndex}].fuels[${fuelIndex}].price`}
                                  value={
                                    formik.values.listing[competitorIndex]
                                      .fuels[fuelIndex].price
                                  }
                                  onChange={formik.handleChange}
                                />
                              ) : (
                                <span>{fuel.price}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </TableContainer>
          ) : (
            <p>No Data...........</p>
          )}
        </DialogContent>
        <Card.Footer>
          <div className="text-end notification-class">
            <button
              className="btn btn-danger me-2"
              type="submit"
              onClick={onClose}
            >
              Close
            </button>
            {hasListing ? (
              <button
                className="btn btn-primary me-2"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Submit
              </button>
            ) : (
              ""
            )}
          </div>
        </Card.Footer>
      </Dialog>
    </>
  );
};

export default Competitormodal;
