// src/FormDialog.js
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function FormDialog({ addMalls }) {
  const [open, setOpen] = React.useState(false);
  const [marketValue, setMarketValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const p = {
      id: 3,
      name: marketValue,
      imageUrl: "",
    };
    addMalls(p);
    handleClose();
  };
  return (
    <div className="add-market">
      <IconButton
        color="primary"
        aria-label="open form"
        onClick={handleClickOpen}
      >
        <AddCircleOutlineIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            value={marketValue}
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            onChange={(e) => setMarketValue(e.target.value)}
          />
          {/* Add more form fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
