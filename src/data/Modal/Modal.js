import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { Button } from "react-bootstrap";

export function FormModal(props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setError(event.target.value.trim() === "");
  };
  
  const handleSave = () => {
    if (inputValue.trim() !== "") {
      handleClose();
      setInputValue("")
   
     
    } else {
      setError(true);
    }
  };
  
  return (
    <div>
      <Button
        className="modal-effect  d-grid mb-3"
        href={`#${props.modalId}`}
        variant="primary"
        onClick={handleClickOpen}
      >
        {props.modalTitle}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {props.modalTitle}
          <Button onClick={handleClose} className="btn-close" variant="">
            x
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.modalContentText}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id={props.modalInputId}
            label={props.modalInputLabel}
            type={props.modalInputType}
            fullWidth
            variant="standard"
            required
            value={inputValue}
            onChange={handleInputChange}
            error={error}
            helperText={error ? "Please enter a value" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="secondary" className="btn btn-danger rounded-11">{props.modalCancelButtonLabel}</Button>
          <Button onClick={handleSave} variant="primary" className="me-1">{props.modalSaveButtonLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
