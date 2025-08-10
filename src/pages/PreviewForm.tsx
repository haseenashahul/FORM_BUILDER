import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  RadioGroup,
  Radio,
  FormHelperText,
  FormLabel,
  Box,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useState } from "react";
import type { FieldConfig } from "../types/form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Validation function
const validateField = (field: FieldConfig, value: any) => {
  const errors: string[] = [];

  // Check if field is required (either field.required is true or validations.notEmpty exists)
  if ((field.required || field.validations?.notEmpty) && !value) {
    errors.push(
      field.validations?.notEmpty?.errorMessage || "This field is required"
    );
  }

  // Number field validation
  if (field.type === "number" && value !== "" && !/^\d+$/.test(value)) {
    errors.push("Only numbers are allowed");
  }

  if (
    field.validations?.minLength &&
    value?.length < Number(field.validations.minLength.value)
  ) {
    errors.push(
      field.validations.minLength.errorMessage ||
        `Minimum length is ${field.validations.minLength.value}`
    );
  }
  if (
    field.validations?.maxLength &&
    value?.length > Number(field.validations.maxLength.value)
  ) {
    errors.push(
      field.validations.maxLength.errorMessage ||
        `Maximum length is ${field.validations.maxLength.value}`
    );
  }
  if (field.validations?.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      errors.push(field.validations.email.errorMessage || "Invalid email address");
    }
  }

  if (field.validations?.passwordRule && value) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(value)) {
      errors.push(
        field.validations.passwordRule.errorMessage ||
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
    }
  }

  return errors;
};

const PreviewForm = () => {

  const location = useLocation();
  const { fields = [] }: { fields: FieldConfig[] } = location.state || {};

  const initialFormData = fields.reduce((acc, field) => {
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      acc[field.id] = field.defaultValue;
    }
    return acc;
  }, {} as Record<string, any>);
  
  const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id: string, value: any, fieldType?: string) => {
    setFormData((prev) => {
      let updated = { ...prev, [id]: value };

      // Auto-update derived fields
      fields.forEach((f) => {
        if (f.parentIds?.includes(id) && f.formula && f.formula.trim() !== "") {
          try {
            let result;

            if (f.formula === "AGE_FROM_DOB") {
              const dobValue = updated[id] || prev[id];
              if (dobValue && dobValue !== "") {
                const dob = new Date(dobValue);
                if (!isNaN(dob.getTime())) {
                  const today = new Date();
                  const age = today.getFullYear() - dob.getFullYear();
                  const monthDiff = today.getMonth() - dob.getMonth();
                  result =
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < dob.getDate())
                      ? age - 1
                      : age;
                } else {
                  result = "";
                }
              } else {
                result = "";
              }
            } else if (f.formula === "FULL_NAME") {
              const nameParts =
                f.parentIds
                  ?.map((parentId) => updated[parentId] || prev[parentId] || "")
                  .filter((part) => part !== "") || [];
              result = nameParts.join(" ").trim();
            } else if (f.formula === "TOTAL_PRICE") {
              const quantity = Number(updated["quantity"] || prev["quantity"] || 0);
              const price = Number(updated["price"] || prev["price"] || 0);
              result = quantity * price;
            } else {
              let formula = f.formula;
              f.parentIds?.forEach((parentId) => {
                const parentValue = updated[parentId] || prev[parentId] || 0;
                formula = formula.replace(new RegExp(parentId, "g"), parentValue);
              });
              // eslint-disable-next-line no-eval
              result = eval(formula);
            }

            updated[f.id] = result;
          } catch (error) {
            updated[f.id] = `Error: ${f.formula}`;
          }
        }
      });

      return updated;
    });

    // Only validate number format live, do NOT clear other errors on typing
    if (fieldType === "number" && value !== "" && !/^\d+$/.test(value)) {
      setErrors((prev) => ({ ...prev, [id]: ["Only numbers are allowed"] }));
    }
  };

  // Check all required fields are filled
  const allRequiredFieldsFilled = fields.every((field) => {
    if (field.required || field.validations?.notEmpty) {
      const val = formData[field.id];
      if (field.type === "checkbox") {
        return Array.isArray(val) && val.length > 0;
      }
      return val !== undefined && val !== null && val !== "";
    }
    return true;
  });

  // Validate all fields on submit
  const handleSubmit = () => {
    const newErrors: Record<string, string[]> = {};
    fields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field.id]);
      if (fieldErrors.length) newErrors[field.id] = fieldErrors;
    });
    setErrors(newErrors);
    setSubmitted(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            <VisibilityIcon sx={{ fontSize: "2rem" }} />
            Form Preview
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Test your form below. Fill in the fields and click "Validate" to
            check for errors.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {fields.map((field) => {
            const fieldError = errors[field.id] || [];

            switch (field.type) {
              case "select":
                return (
                  <TextField
                    select
                    key={field.id}
                    label={field.label}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleChange(field.id, e.target.value, field.type)
                    }
                    fullWidth
                    variant="outlined"
                    error={!!fieldError.length}
                    helperText={fieldError.join(", ")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {field.options?.map((opt, i) => (
                      <MenuItem key={i} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                );

              case "checkbox":
                return (
                  <Box
                    key={field.id}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                    }}
                  >
                    <FormLabel
                      sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                      {field.label}
                    </FormLabel>
                    <Stack spacing={1}>
                      {field.options?.map((opt, i) => (
                        <FormControlLabel
                          key={i}
                          control={
                            <Checkbox
                              checked={formData[field.id]?.includes(opt) || false}
                              onChange={(e) => {
                                const newVal = formData[field.id] || [];
                                if (e.target.checked) {
                                  handleChange(field.id, [...newVal, opt], field.type);
                                } else {
                                  handleChange(
                                    field.id,
                                    newVal.filter((o: string) => o !== opt),
                                    field.type
                                  );
                                }
                              }}
                              sx={{
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                          }
                          label={opt}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.95rem",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                    {fieldError.length > 0 && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {fieldError.join(", ")}
                      </FormHelperText>
                    )}
                  </Box>
                );

              case "radio":
                return (
                  <Box
                    key={field.id}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                    }}
                  >
                    <FormLabel
                      sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                      {field.label}
                    </FormLabel>
                    <RadioGroup
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        handleChange(field.id, e.target.value, field.type)
                      }
                    >
                      <Stack spacing={1}>
                        {field.options?.map((opt, i) => (
                          <FormControlLabel
                            key={i}
                            value={opt}
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "primary.main",
                                  },
                                }}
                              />
                            }
                            label={opt}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontSize: "0.95rem",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                    {fieldError.length > 0 && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {fieldError.join(", ")}
                      </FormHelperText>
                    )}
                  </Box>
                );

              default:
                return (
                  <TextField
                    key={field.id}
                    label={field.label}
                    fullWidth
                    type={field.type === "number" ? "text" : field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleChange(field.id, e.target.value, field.type)
                    }
                    required={field.required}
                    error={!!fieldError.length}
                    helperText={fieldError.join(", ")}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                );
            }
          })}
        </Stack>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            Validate Form
          </Button>
        </Box>

        {submitted && Object.keys(errors).length === 0 && allRequiredFieldsFilled && (
          <Alert
            severity="success"
            sx={{
              mt: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
            icon={<CheckCircleIcon />}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Form is valid! All fields have been validated successfully.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PreviewForm;
