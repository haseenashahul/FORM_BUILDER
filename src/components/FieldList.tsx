import { useDispatch } from "react-redux";
import type { FieldConfig, FieldValidations } from "../types/form";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateField } from "../redux/formSlice";


interface Props {
  fields: FieldConfig[];
  onDelete: (id: string) => void;
}

const FieldList = ({ fields, onDelete }: Props) => {
  const dispatch = useDispatch();

  const handleChange = (id: string, key: keyof FieldConfig, value: any) => {
    const field = fields.find((f) => f.id === id);
    if (!field) return;
    dispatch(updateField({ ...field, [key]: value }));
  };

  const handleValidationChange = (
    fieldId: string,
    ruleKey: keyof FieldValidations,
    value: any
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newValidations = {
      ...(field.validations || {}),
      [ruleKey]: value,
    };
    dispatch(updateField({ ...field, validations: newValidations }));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {fields.length === 0 && (
        <Typography variant="body1">No fields added yet.</Typography>
      )}
      {fields.map((field) => (
        <Box
          key={field.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: 2,
          }}
        >
          {/* Row 1: Type, Label, Default Value, Delete */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Select
              value={field.type}
              onChange={(e) => handleChange(field.id, "type", e.target.value)}
              sx={{ width: 150 }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="textarea">Textarea</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="radio">Radio</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>

            <TextField
              label="Label"
              value={field.label}
              onChange={(e) => handleChange(field.id, "label", e.target.value)}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Default Value"
              value={field.defaultValue || ""}
              disabled={field.isDerived}
              onChange={(e) =>
                handleChange(field.id, "defaultValue", e.target.value)
              }
              sx={{ flex: 1 }}
            />

            <IconButton color="error" onClick={() => onDelete(field.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          {/* Options for select/radio/checkbox */}
          {["select", "radio", "checkbox"].includes(field.type) && (
            <TextField
              label="Options (comma-separated)"
              value={field.options?.join(",") || ""}
              onChange={(e) =>
                handleChange(
                  field.id,
                  "options",
                  e.target.value.split(",").map((opt) => opt.trim())
                )
              }
              placeholder="e.g. Option 1, Option 2, Option 3"
              fullWidth
            />
          )}

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
            {/* Required toggle */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.required}
                  onChange={(e) =>
                    handleChange(field.id, "required", e.target.checked)
                  }
                />
              }
              label="Required"
            />

            {/* Validation toggles */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.validations?.notEmpty}
                  onChange={(e) =>
                    handleValidationChange(
                      field.id,
                      "notEmpty",
                      e.target.checked
                        ? { errorMessage: "Field cannot be empty" }
                        : undefined
                    )
                  }
                />
              }
              label="Not Empty"
            /> */}

            <TextField
              label="Min Length"
              type="number"
              value={field.validations?.minLength?.value || ""}
              onChange={(e) =>
                handleValidationChange(field.id, "minLength", {
                  value: Number(e.target.value),
                  errorMessage: `Minimum length is ${e.target.value}`,
                })
              }
              sx={{ width: 120 }}
            />

            <TextField
              label="Max Length"
              type="number"
              value={field.validations?.maxLength?.value || ""}
              onChange={(e) =>
                handleValidationChange(field.id, "maxLength", {
                  value: Number(e.target.value),
                  errorMessage: `Maximum length is ${e.target.value}`,
                })
              }
              sx={{ width: 120 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.validations?.email}
                  onChange={(e) =>
                    handleValidationChange(
                      field.id,
                      "email",
                      e.target.checked
                        ? { errorMessage: "Invalid email format" }
                        : undefined
                    )
                  }
                />
              }
              label="Email Format"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.validations?.passwordRule}
                  onChange={(e) =>
                    handleValidationChange(
                      field.id,
                      "passwordRule",
                      e.target.checked
                        ? {
                            value: /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/,
                            errorMessage:
                              "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                          }
                        : undefined
                    )
                  }
                />
              }
              label="Password Rule"
            />
          </Box>

          {/* Derived field toggle */}
          <FormControlLabel
            control={
              <Checkbox
                checked={!!field.isDerived}
                onChange={(e) =>
                  handleChange(field.id, "isDerived", e.target.checked)
                }
              />
            }
            label="Derived Field"
          />

          {/* If derived, show parent selector & formula */}
          {field.isDerived && (
            <>
              <Select
                multiple
                value={field.parentIds || []}
                onChange={(e) =>
                  handleChange(
                    field.id,
                    "parentIds",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                input={<OutlinedInput label="Parent Fields" />}
              >
                {fields
                  .filter((f) => f.id !== field.id)
                  .map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.label}
                    </MenuItem>
                  ))}
              </Select>

              <TextField
                label="Derived Formula"
                value={field.formula || ""}
                onChange={(e) =>
                  handleChange(field.id, "formula", e.target.value)
                }
                placeholder="AGE_FROM_DOB , FULL_NAME"
                fullWidth
              />
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default FieldList;
