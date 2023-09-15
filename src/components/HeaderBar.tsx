import * as React from 'react';
import { AppBar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { cyan, lightBlue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: cyan,
        secondary: lightBlue,
    }    
});

export default function HeaderBar() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <AppBar position="fixed" color='primary'>
                    <Typography variant="h3" align='center'>Markdown Editor</Typography>
                </AppBar>
            </ThemeProvider>
        </>
    )
}
