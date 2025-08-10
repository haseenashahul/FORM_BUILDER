import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux";
import { addField, deleteField, resetCurrentForm, saveForm } from "../redux/formSlice";
import { v4 as uuidv4 } from 'uuid';
import type { FormSchema } from "../types/form";
import { saveFormToStorage } from "../utils/localStorage";
import { Container, Typography, Button, Tooltip, IconButton, Box, Paper, Stack } from "@mui/material";
import FieldList from "../components/FieldList";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import HomeIcon from "@mui/icons-material/Home";

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fields = useSelector((state: RootState) => state.form.currentForm);

  const handleAddField = () => {
    dispatch(addField({
      id: uuidv4(),
      type: "text",
      label: "New Field",
    }));
  };

  const handleSaveForm = () => {
    const name = prompt("Enter form name:");
    if (!name) return;
    const form: FormSchema = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      fields,
    };
    saveFormToStorage(form);
    dispatch(saveForm(form));
    dispatch(resetCurrentForm());
  };

  const handlePreview = () => {
    navigate("/preview", { state: { fields } });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Tooltip title="Go to Home">
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "primary.light",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            Create Form
            {fields.length > 0 && (
              <Tooltip title="Preview Form">
                <IconButton
                  onClick={handlePreview}
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Build your custom form by adding fields below. You can preview and save your form once you've added at least one field.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleAddField}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              }
            }}
          >
            Add Field
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FieldList fields={fields} onDelete={(id) => dispatch(deleteField(id))} />
        </Box>

        {fields.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: 'grey.50'
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No fields added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Add Field" to start building your form
            </Typography>
          </Box>
        )}

        {fields.length > 0 && (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSaveForm}
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Save Form
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  )
}

export default CreateForm