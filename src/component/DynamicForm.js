import React, { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

const DynamicForm = ({
  intialFields,
  modifyTripData,
  actionBtn,
  renderComp,
}) => {
  const [fields, setFields] = useState(intialFields);
  useEffect(() => {
    setFields(intialFields);
  }, [intialFields]);
  const handleInputChange = (name, event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const updatedFields = fields.map((field) =>
      field.name === name ? { ...field, value: value } : field
    );
    setFields(updatedFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <FormControl
            fullWidth
            margin="normal"
            key={field.name}
            variant="outlined"
          >
            {field.type === "text" ||
            field.type === "email" ||
            field.type === "number" ? (
              <TextField
                label={field.label}
                type={field.type}
                value={field.value}
                onChange={(event) => handleInputChange(field.name, event)}
              />
            ) : field.type === "select" ? (
              <>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={field.value}
                  onChange={(event) => handleInputChange(field.name, event)}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : field.type === "switch" ? (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(event) => handleInputChange(field.name, event)}
                    />
                  }
                  label={field.label}
                />
              </FormGroup>
            ) : null}
          </FormControl>
        ))}
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(renderComp, "pop");
            if (fields[0]?.value?.length && renderComp === "nodeForm")
              modifyTripData("nodeForm", fields);
            actionBtn.secondary.action();
          }}
        >
          {actionBtn.secondary.text}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(fields, "pop");
            actionBtn.primary.action();
            if (fields[0]?.value?.length) modifyTripData("nodeForm", fields);
          }}
        >
          {actionBtn.primary.text}
        </Button>
      </form>
    </Container>
  );
};

export default DynamicForm;
