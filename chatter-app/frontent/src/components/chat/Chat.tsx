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
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 헤더 영역 */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <h1>{data?.chat.name}</h1>
      </Box>

      {/* 메시지 영역 - 입력창 높이만큼 하단 여백 확보 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          paddingBottom: '80px', // 입력창 공간 확보
          minHeight: 0, // flex item이 축소될 수 있도록
        }}
      >
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

      {/* 입력창 - 절대 위치로 하단 고정 */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderRadius: '4px',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
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
    </Box>
  );
};

export default Chat;
