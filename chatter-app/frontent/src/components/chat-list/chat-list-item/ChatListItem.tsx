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
            <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
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
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' component='li' />
    </>
  );
};

export default ChatListItem;
