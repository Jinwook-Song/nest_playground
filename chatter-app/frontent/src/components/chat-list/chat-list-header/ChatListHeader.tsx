import { AppBar, IconButton, Toolbar } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';

interface ChatListHeaderProps {
  onAddChat: () => void;
}

const ChatListHeader = ({ onAddChat }: ChatListHeaderProps) => {
  return (
    <AppBar position='static' color='transparent'>
      <Toolbar>
        <IconButton
          size='large'
          color='inherit'
          edge='start'
          onClick={onAddChat}
        >
          <AddCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatListHeader;
