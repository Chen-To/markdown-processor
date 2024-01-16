import * as React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: lightBlue,
    }    
});

export default function HeaderBar() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ position: "static" }}>
                    <AppBar position="static" color='primary'>
                        <Toolbar>
                            <Typography variant="h5" color="white">Markdown Editor</Typography>
                        </Toolbar>
                    </AppBar>
                </Box>
            </ThemeProvider>
        </>
        
    )
}
