import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface ChatListAddProps {
  open: boolean;
  onClose: () => void;
}

const ChatListAdd = ({ open, onClose }: ChatListAddProps) => {
  const [isPrivateChat, setIsPrivateChat] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant='h6' component={'h2'}>
            Add Chat
          </Typography>
          <FormGroup>
            <FormControlLabel
              style={{ width: 0 }}
              control={
                <Switch
                  value={isPrivateChat}
                  onChange={(e) => setIsPrivateChat(e.target.checked)}
                />
              }
              label='Private'
            />
          </FormGroup>
          {isPrivateChat ? (
            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder='Search Users' />
              <IconButton sx={{ p: '10px' }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          ) : (
            <TextField label='Name' />
          )}
          <Button variant='outlined'>Save</Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChatListAdd;
