import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface AuthProps {
  submitLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  children: React.ReactNode;
  error?: string;
}

const Auth = ({ submitLabel, onSubmit, children, error }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await onSubmit({ email, password });
  };
  return (
    <Stack
      spacing={2}
      sx={{
        height: '100vh',
        minWidth: '300px',
        maxWidth: '30%',
        mx: 'auto',
        justifyContent: 'center',
      }}
    >
      <TextField
        type='email'
        label='Email'
        variant='outlined'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <TextField
        type='password'
        label='Password'
        variant='outlined'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={handleSubmit}
      >
        {submitLabel}
      </Button>
      {children}
    </Stack>
  );
};

export default Auth;
