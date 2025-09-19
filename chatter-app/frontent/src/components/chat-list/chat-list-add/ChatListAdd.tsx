import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useCreateChat } from '../../../hooks/useCreateChat';
import { UNKNOWN_ERROR_MESSAGE } from '../../../constants/errors';
import router from '../../Routes';

interface ChatListAddProps {
  open: boolean;
  onClose: () => void;
}

const ChatListAdd = ({ open, onClose }: ChatListAddProps) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const [createChat] = useCreateChat();

  const handleClose = (chatId?: string) => {
    onClose();
    setError(undefined);
    setName(undefined);

    if (chatId) {
      router.navigate(`/chats/${chatId}`);
    }
  };

  return (
    <Modal open={open} onClose={() => handleClose}>
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

          <TextField
            label='Name'
            value={name}
            error={!!error}
            helperText={error}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant='outlined'
            onClick={() => {
              if (!name?.length) {
                setError('Name is required');
                return;
              }
              setError(undefined);
              createChat({
                variables: {
                  createChatInput: { name },
                },
              })
                .then(({ data }) => handleClose(data?.createChat._id))
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
