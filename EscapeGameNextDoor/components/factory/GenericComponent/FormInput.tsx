import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number | boolean | File | null;
  type?: "text" | "email" | "number" | "select" | "checkbox" | "file";
  options?: { label: string; value: string | number }[]; // For select dropdowns
  onChange: (name: string, value: string | number | boolean | File | null) => void;
}

/**
 * FormInput is a reusable component that renders a form input based on the provided `type` prop.
 * The component automatically handles the input change event and calls the `onChange` function
 * with the name of the input and the new value. The component also handles the rendering of the
 * input based on the type. For example, if the type is "select", the component will render a
 * `Select` component with the provided options. If the type is "checkbox", the component will
 * render a `FormControlLabel` component with a `Checkbox` component. If the type is "file", the
 * component will render a `Button` component with a hidden `input` element to handle the file
 * selection.
 *
 * @param {string} label - The label for the input.
 * @param {string} name - The name of the input.
 * @param {string | number | boolean | File | null} value - The value of the input.
 * @param {"text" | "email" | "number" | "select" | "checkbox" | "file"} type - The type of input.
 * @param {{ label: string; value: string | number }[]} options - The options for the select dropdown.
 * @param {(name: string, value: string | number | boolean | File | null) => void} onChange - The function to call when the input changes.
 * @returns {React.ReactElement}
 */
const FormInput: React.FC<FormInputProps> = ({ label, name, value, type = "text", options, onChange }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    if (type === "file") {
      onChange(name, target.files?.[0] || null);
    } else if (type === "checkbox") {
      onChange(name, target.checked);
    } else {
      onChange(name, target.value);
    }
  };

  return (
    <>
      {type === "select" ? (
        <FormControl fullWidth margin="normal">
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={(e) => onChange(name, e.target.value)} name={name}>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : type === "checkbox" ? (
        <FormControlLabel
          control={<Checkbox checked={value as boolean} onChange={handleChange} name={name} />}
          label={label}
        />
      ) : type === "file" ? (
        <Button variant="outlined" component="label">
          {label}
          <input type="file" hidden onChange={handleChange} accept="image/*" />
        </Button>
      ) : (
        <TextField
          label={label}
          name={name}
          value={value}
          type={type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      )}
    </>
  );
};

export default FormInput;
