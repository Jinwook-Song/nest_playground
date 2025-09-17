import { useParams } from 'react-router-dom';
import { useGetChat } from '../../hooks/useGetChat';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import { useCreateMessage } from '../../hooks/useCreateMessage';
import { useEffect, useRef, useState } from 'react';
import { useGetMessages } from '../../hooks/useGetMessages';

const Chat = () => {
  const params = useParams();
  const chatId = params._id!;

  const [messageText, setMessageText] = useState('');
  const { data } = useGetChat({ _id: chatId });
  const [createMessage, { loading }] = useCreateMessage(chatId);
  const { data: messages } = useGetMessages({ chatId });
  const divRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => divRef.current?.scrollIntoView();

  const handleCreateMessage = async () => {
    await createMessage({
      variables: { createMessageInput: { content: messageText, chatId } },
    });
    setMessageText('');
    scrollToBottom();
  };

  useEffect(() => {
    setMessageText('');
    scrollToBottom();
  }, [chatId]);

  return (
    <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
      <h1>{data?.chat.name}</h1>
      <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        {messages?.messages.map((message) => (
          <Box
            key={message._id || message.content}
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              gap: 2,
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <Avatar src='' sx={{ width: 52, height: 52 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack>
                <Paper sx={{ width: 'fit-content' }}>
                  <Typography sx={{ padding: '0.9rem' }}>
                    {message.content}
                  </Typography>
                </Paper>
                <Typography variant='caption' sx={{ marginLeft: '0.25rem' }}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Stack>
            </Box>
          </Box>
        ))}
        <div ref={divRef}></div>
      </Box>
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
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              await handleCreateMessage();
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        <IconButton
          disabled={loading}
          color='primary'
          sx={{ p: '10px' }}
          onClick={handleCreateMessage}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
