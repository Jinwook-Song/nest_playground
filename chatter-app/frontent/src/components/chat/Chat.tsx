import { useParams } from 'react-router-dom';
import { useGetChat } from '../../hooks/useGetChat';
import { Divider, IconButton, Paper, Stack } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import { useCreateMessage } from '../../hooks/useCreateMessage';
import { useState } from 'react';

const Chat = () => {
  const params = useParams();
  const chatId = params._id!;

  const [message, setMessage] = useState('');
  const { data } = useGetChat({ _id: chatId });
  const [createMessage] = useCreateMessage();

  return (
    <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
      <h1>{data?.chat.name}</h1>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          justifySelf: 'flex-end',
          alignItems: 'center',
          width: '100%',
          mb: 4,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: '100%' }}
          placeholder='Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        <IconButton
          color='primary'
          sx={{ p: '10px' }}
          onClick={() =>
            createMessage({
              variables: {
                createMessageInput: { content: message, chatId },
              },
            })
          }
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
