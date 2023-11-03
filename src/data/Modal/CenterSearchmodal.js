import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Loaderimg from "../../Utils/Loader";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineClose } from "react-icons/ai";

const CenterSearchmodal = (props) => {
  const {
    title,
    sidebarContent,
    visible,
    onClose,
    onSubmit,
    searchListstatus,
  } = props;
  const [open, setOpen] = useState(false);
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
    // event.preventDefault();

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
      handleClose();
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
    const inputDateElement = document.querySelector('#start-date[type="date"]');
    inputDateElement.showPicker();
  };
  const hadndleShowDate2 = () => {
    const inputDateElement = document.querySelector('#end-date[type="date"]');
    inputDateElement.showPicker();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(); // Call your search function here
    }
  };

  return (
    <div>
      <div className="d-flex searchbar-top">
        <Button
          variant="primary"
          className="modal-effect d-grid mb-2 d-flex"
          href="#modaldemo8"
          onClick={handleClickOpen}
        >
          Search{" "}
          <span className="ms-2">
            <SearchIcon />
          </span>
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        className="ModalTitle"
      >
        <Modal.Header
          style={{
            color: "#fff",
            background: "#6259ca",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div >
            <Modal.Title style={{
              margin: "auto "
            }}>
              Search</Modal.Title>
          </div>
          <div>
            <span
              className="modal-icon"
              onClick={handleClose}
              style={{ cursor: "pointer" }}
            >
              <AiOutlineClose />
            </span>
          </div>
        </Modal.Header>

        <DialogContent>
          <DialogContentText>
            <>
              {isLoading ? (
                <Loaderimg />
              ) : (
                <>
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
                        // onChange={(e) => setSearchQuery(e.target.value)}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress} // Add the onKeyDown event handler here
                      />
                    </div>
                    <div className="d-flex ">
                      <div className="form-group" style={{ width: "50%" }}>
                        <label
                          className=" form-label mt-4"
                          htmlFor="start-date"
                        >
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
                          onClick={hadndleShowDate2}
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
                </>
              )}
            </>
          </DialogContentText>
        </DialogContent>
        <hr />
        <DialogActions>
          <div className="text-end">
            <button
              type="Search"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Search
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CenterSearchmodal.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default CenterSearchmodal;
