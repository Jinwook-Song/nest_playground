import {
  Container,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
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

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Guard>
          {showChatList ? (
            <Grid container>
              <Grid columns={3}>
                <ChatList />
              </Grid>
              <Grid columns={9} flexGrow={1}>
                <Routes />
              </Grid>
            </Grid>
          ) : (
            <Routes />
          )}
        </Guard>
        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
}

const Routes = () => {
  return (
    <Container sx={{ height: '100%' }}>
      <RouterProvider router={router} />
    </Container>
  );
};

export default App;
