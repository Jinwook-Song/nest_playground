import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import { Divider, Stack } from '@mui/material';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        onClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader onAddChat={() => setChatListAddVisible(true)} />
        <Divider />
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          {new Array(30).fill(0).map((_, index) => (
            <ChatListItem key={index} />
          ))}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
