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
import { useCreateChat } from '../../../hooks/useCreateChat';
import { UNKNOWN_ERROR_MESSAGE } from '../../../constants/errors';

interface ChatListAddProps {
  open: boolean;
  onClose: () => void;
}

const ChatListAdd = ({ open, onClose }: ChatListAddProps) => {
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const [createChat] = useCreateChat();

  const handleClose = () => {
    onClose();
    setError(undefined);
    setName(undefined);
    setIsPrivateChat(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
            <TextField
              label='Name'
              value={name}
              error={!!error}
              helperText={error}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Button
            variant='outlined'
            onClick={() => {
              if (!isPrivateChat && !name?.length) {
                setError('Name is required');
                return;
              }
              setError(undefined);
              createChat({
                variables: {
                  createChatInput: {
                    isPrivate: isPrivateChat,
                    name,
                  },
                },
              })
                .then(handleClose)
                .catch((_error) => {
                  setError(UNKNOWN_ERROR_MESSAGE);
                });
            }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChatListAdd;
