import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import { Divider, Stack } from '@mui/material';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data } = useGetChats();
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
            height: 'calc(100vh - 128px)',
            overflow: 'auto',
          }}
        >
          {data?.chats.map((chat) => (
            <ChatListItem key={chat._id} chat={chat} />
          ))}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
