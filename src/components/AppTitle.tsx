import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material"
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default (): JSX.Element => {
    return <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    RS Playlist Manager
                </Typography>
                <IconButton size="large" color="inherit">
                    <QueueMusicIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    </Box>
}