import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Container, 
  Paper, 
  Stack,
  Chip,
  Divider
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getFormsFromStorage } from "../utils/localStorage";
import type { FormSchema } from "../types/form";

const MyForms = () => {
  const navigate = useNavigate();
  const forms: FormSchema[] = getFormsFromStorage();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              mb: 2,
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            My Forms
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Manage and preview your saved forms. Create new forms or test existing ones.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Add New Form card */}
          <Card
            sx={{
              width: 300,
              height: 180,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "grey.400",
              backgroundColor: "grey.50",
              color: "grey.600",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor: "primary.50",
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => navigate("/create")}
            aria-label="Add New Form"
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                textAlign: "center",
              }}
            >
              <IconButton
                color="inherit"
                size="large"
                sx={{ 
                  pointerEvents: "none",
                  backgroundColor: "rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.08)",
                  }
                }}
              >
                <AddCircleOutlineIcon sx={{ fontSize: 48 }} />
              </IconButton>
              <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                Create New Form
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Start building a new form
              </Typography>
            </CardContent>
          </Card>

          {/* Existing saved forms */}
          {forms.length === 0 ? (
            <Box 
              sx={{ 
                width: "100%", 
                textAlign: "center", 
                py: 8,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: 'grey.50'
              }}
            >
              <DescriptionIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No saved forms yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first form to get started
              </Typography>
            </Box>
          ) : (
            forms.map((form) => (
              <Card
                key={form.id}
                sx={{
                  width: 300,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate("/preview", { state: { fields: form.fields, formName: form.name } })}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        {form.name}
                      </Typography>
                      
                      <Chip 
                        label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(form.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontStyle: 'italic',
                        fontSize: '0.875rem'
                      }}
                    >
                      Click to preview and test this form
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default MyForms;
