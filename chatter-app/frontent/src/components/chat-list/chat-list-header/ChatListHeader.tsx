import { AppBar, IconButton, Toolbar } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';

const ChatListHeader = () => {
  return (
    <AppBar position='static' color='transparent'>
      <Toolbar>
        <IconButton size='large' color='inherit' edge='start'>
          <AddCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatListHeader;
