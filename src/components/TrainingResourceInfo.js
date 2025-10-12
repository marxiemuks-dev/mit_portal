import { AppBar, Button, Divider, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

const TrainingResourceInfo = ({handleClose}) => {
  return (
    <div>
        <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Training and Resources
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <List>
              <ListItemButton>
                <ListItemText primary="Phone ringtone" secondary="Titania" />
              </ListItemButton>
              <Divider />
              <ListItemButton>
                <ListItemText
                  primary="Default notification ringtone"
                  secondary="Tethys"
                />
              </ListItemButton>
            </List>
    </div>
  )
}

export default TrainingResourceInfo
