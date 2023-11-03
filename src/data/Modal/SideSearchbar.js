import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaderimg from "../../Utils/Loader";

const SideSearchbar = (props) => {
  const {
    title,
    sidebarContent,
    visible,
    onClose,
    onSubmit,
    searchListstatus,
  } = props;

  const [keyword, setSearchQuery] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (searchListstatus) {
      setSearchQuery("");
      setStartDate("");
      setEndDate("");
    }
  }, [onSubmit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (start_date && !end_date) {
      setErrorMessage("Please select an end date");
      return;
    }

    if (!start_date && end_date) {
      setErrorMessage("Please select a start date");
      return;
    }

    setErrorMessage("");
    setLoading(true); // Set loading state to true

    const formData = {
      keyword,
      start_date,
      end_date,
    };

    try {
      // Perform your form submission or API request here
      // Example: await axiosInstance.post("/submit-form", formData);
      await onSubmit(formData);
    } catch (error) {
      // Handle any errors that occurred during the form submission or API request
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div className={`common-sidebar ${visible ? "visible" : ""}`}>
            <div className="card">
              <div className="card-header text-center SidebarSearchheader">
                <h3 className="SidebarSearch-title m-0">{title}</h3>
                <button className="close-button" onClick={onClose}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label className=" form-label mt-4" htmlFor="Search">
                      Search:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      placeholder="Enter your search item"
                      value={keyword}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="d-flex ">
                    <div className="form-group" style={{ width: "50%" }}>
                      <label className=" form-label mt-4" htmlFor="start-date">
                        Start Date:
                      </label>
                      <input
                        type="date"
                        min={"2023-01-01"}
                        max={getCurrentDate()}
                        onClick={hadndleShowDate}
                        id="start-date"
                        className="form-control"
                        value={start_date}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group ms-2" style={{ width: "50%" }}>
                      <label className=" form-label mt-4" htmlFor="end-date">
                        End Date:
                      </label>
                      <input
                        type="date"
                        min={"2023-01-01"}
                        max={getCurrentDate()}
                        onClick={hadndleShowDate}
                        id="end-date"
                        className="form-control"
                        value={end_date}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                  )}
                </form>
                <div className="text-end">
                  <button
                    type="Search"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Search
                  </button>
                  <button className="btn btn-danger ms-2" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SideSearchbar.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default SideSearchbar;
