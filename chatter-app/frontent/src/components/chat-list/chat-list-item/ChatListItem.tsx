import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { ChatsQuery } from '../../../gql/graphql';
import router from '../../../components/Routes';

interface ChatListItemProps {
  chat: ChatsQuery['chats'][number];
  selected: boolean;
}

const ChatListItem = ({ chat, selected }: ChatListItemProps) => {
  return (
    <>
      <ListItem alignItems='flex-start' disablePadding>
        <ListItemButton
          onClick={() => {
            router.navigate(`/chats/${chat._id}`);
          }}
          selected={selected}
        >
          <ListItemAvatar>
            <Avatar alt='Remy Sharp' src={chat.latestMessage?.user?.imageUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={chat.name}
            secondary={
              <>
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  {chat.latestMessage?.user?.username ?? ''}
                </Typography>
                <Typography
                  component='span'
                  variant='body2'
                  sx={{
                    display: 'inline-block',
                    ml: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '150px',
                    verticalAlign: 'top',
                  }}
                >
                  {chat.latestMessage?.content ?? ''}
                </Typography>
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' />
    </>
  );
};

export default ChatListItem;
