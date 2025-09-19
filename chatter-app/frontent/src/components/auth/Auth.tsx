import { Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetMe } from '../../hooks/useGetMe';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  submitLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  children: React.ReactNode;
  error?: string;
  extraFields?: React.ReactNode[];
}

const Auth = ({
  submitLabel,
  onSubmit,
  children,
  error,
  extraFields,
}: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: user } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

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
      {extraFields}
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
