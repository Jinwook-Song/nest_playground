import { useParams } from 'react-router-dom';
import { useGetChat } from '../../hooks/useGetChat';

const Chat = () => {
  const { _id } = useParams();
  const { data } = useGetChat({ _id: _id as string });
  return <h1>{data?.chat.name}</h1>;
};

export default Chat;
