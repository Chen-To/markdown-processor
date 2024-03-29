import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: lightBlue,
    }    
});

const openMarkdownDocs = () => {
    window.open("https://www.markdownguide.org/basic-syntax/", "_blank");
}

export default function HeaderBar() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ position: "static", flexGrow: 1 }}>
                    <AppBar position="static" color='primary'>
                        <Toolbar>
                            <Typography variant="h5" color="white" sx={{ flexGrow: 1 }}>{process.env.APP_NAME}</Typography>
                            <Button color="inherit" onClick={openMarkdownDocs}>
                                Markdown Syntax
                                <OpenInNewIcon/>
                            </Button>
                            <IconButton
                                href='https://github.com/Chen-To/markdown-processor'
                                size="large"
                            >
                                <GitHubIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </Box>
            </ThemeProvider>
        </>
        
    )
}
