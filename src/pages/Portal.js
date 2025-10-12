import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PortalPage = () => {
  const navigate = useNavigate();

  const sections = [
    { title: 'Data Management', description: 'Manage GAD-related data including programs, beneficiaries, and resources.', path: '/data-management' },
    { title: 'Budget Monitoring', description: 'Track and report on GAD budget allocation and expenditures.', path: '/budget-monitoring' },
    { title: 'Reports and Analytics', description: 'Generate reports and visualize GAD data using charts and graphs.', path: '/reports-analytics' },
    { title: 'Compliance Monitoring', description: 'Monitor GAD compliance and ensure alignment with regulations.', path: '/compliance-monitoring' },
    { title: 'Training and Resources', description: 'Access GAD-related training materials, policies, and resources.', path: '/training-resources' },
    { title: 'Help Desk', description: 'Provide support and assistance for GAD-related inquiries and issues.', path: '/help-desk' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>GAD Management System (GAD MIS) Portal</Typography>
      <Grid container spacing={3}>
        {sections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{section.title}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>{section.description}</Typography>
              </CardContent>
              <Button variant="contained" onClick={() => navigate(section.path)} sx={{minHeight:'60px'}}>
                Go to {section.title}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PortalPage;
