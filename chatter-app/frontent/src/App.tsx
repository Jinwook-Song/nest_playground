import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import router from './components/Routes';
import client from './constants/apollo-client';
import Guard from './components/auth/Guard';
import Header from './components/header/Header';
import Snackbar from './components/snackbar/Snackbar';
import ChatList from './components/chat-list/ChatList';
import { usePath } from './hooks/usePath';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { showChatList } = usePath();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Guard>
          <Container
            maxWidth='xl'
            sx={{
              height: 'calc(100vh - 64px)', // Header 높이 제외한 전체 높이
              px: isMobile ? 1 : 3, // 모바일에서 패딩 줄이기
              py: isMobile ? 1 : 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {showChatList ? (
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  gap: 3,
                  flexDirection: isMobile ? 'column' : 'row',
                }}
              >
                {/* 채팅 리스트 - 모바일에서는 상단, 데스크탑에서는 좌측 */}
                <Box
                  sx={{
                    width: isMobile ? '100%' : isTablet ? '280px' : '320px',
                    minWidth: isMobile ? 'auto' : isTablet ? '260px' : '300px',
                    maxWidth: isMobile ? '100%' : isTablet ? '320px' : '380px',
                    height: isMobile ? '35vh' : '100%', // 모바일에서는 화면의 35%만 차지
                    maxHeight: isMobile ? '350px' : '100%', // 최대 높이 제한
                    flexShrink: 0,
                    overflow: isMobile ? 'auto' : 'visible', // 모바일에서 스크롤 가능
                  }}
                >
                  <ChatList />
                </Box>

                {/* 채팅 영역 - 나머지 공간 차지 */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0, // flex item이 축소될 수 있도록
                    height: '100%',
                  }}
                >
                  <Routes />
                </Box>
              </Box>
            ) : (
              <Routes />
            )}
          </Container>
        </Guard>
        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
}

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default App;
