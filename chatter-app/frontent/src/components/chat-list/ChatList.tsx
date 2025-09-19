import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import { Divider, Stack } from '@mui/material';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';
import { usePath } from '../../hooks/usePath';
import { useMessageCreated } from '../../hooks/useMessageCreated';

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data } = useGetChats();
  const { path } = usePath();

  useMessageCreated({ chatIds: data?.chats.map((chat) => chat._id) ?? [] });
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
            bgcolor: 'background.paper',
            height: 'calc(100vh - 128px)',
            overflow: 'auto',
          }}
        >
          {data?.chats &&
            [...data.chats]
              .sort(
                (a, b) =>
                  new Date(a.latestMessage?.createdAt).getTime() -
                  new Date(b.latestMessage?.createdAt).getTime(),
              )
              .map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  selected={path.includes(chat._id)}
                />
              ))
              .reverse()}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
