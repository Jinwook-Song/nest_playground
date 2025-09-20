import ChatListItem from './chat-list-item/ChatListItem';
import { Box, Divider, Stack } from '@mui/material';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { useEffect, useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';
import { usePath } from '../../hooks/usePath';
import { useMessageCreated } from '../../hooks/useMessageCreated';
import { PAGE_SIZE } from '../../constants/page-size';
import InfiniteScroll from 'react-infinite-scroller';
import { useCountChats } from '../../hooks/useCountChats';

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data, fetchMore } = useGetChats({ skip: 0, limit: PAGE_SIZE });
  const { path } = usePath();
  const { chatsCount, countChats } = useCountChats();

  useEffect(() => {
    countChats();
  }, [countChats]);

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
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            height: 'calc(100vh - 128px)',
            overflow: 'auto',
          }}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={() =>
              fetchMore({
                variables: {
                  skip: data?.chats.length,
                },
              })
            }
            hasMore={
              data?.chats && chatsCount ? data.chats.length < chatsCount : false
            }
            useWindow={false}
            threshold={100}
            initialLoad={false}
          >
            {data?.chats &&
              [...data.chats]
                .sort((chatA, chatB) => {
                  if (!chatA.latestMessage) {
                    return -1;
                  }
                  return (
                    new Date(chatA.latestMessage?.createdAt).getTime() -
                    new Date(chatB.latestMessage?.createdAt).getTime()
                  );
                })
                .map((chat) => (
                  <ChatListItem
                    key={chat._id}
                    chat={chat}
                    selected={path.includes(chat._id)}
                  />
                ))
                .reverse()}
          </InfiniteScroll>
        </Box>
      </Stack>
    </>
  );
};

export default ChatList;
