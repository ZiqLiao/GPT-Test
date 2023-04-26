import { Box, Grid, Paper } from '@mui/material';
import React from 'react';
import UoMlogo from '../Logo/UoMlogo';
import Copyright from '../Copyright/Copyright';

function EditProfileLayout({ component }: any) {
  return (
    <Grid
      container
      component="main"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(153,162,170,.2)',
        minHeight: '100vh',
        paddingTop: '8px',
        paddingBottom: '10px',
      }}
    >
      <Grid
        item
        xs={12}
        sm={10}
        md={9}
        lg={7}
        component={Paper}
        elevation={5}
        square
        sx={{
          position: 'relative',
        }}
      >
        <Box />
        <UoMlogo />
        {component}
        <Copyright sx={{ mt: 5, mb: 5 }} />
      </Grid>
    </Grid>
  );
}

export default EditProfileLayout;
