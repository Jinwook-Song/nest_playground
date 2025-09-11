import { Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import router from '../Routes';

const Branding = () => {
  return (
    <>
      <ForumIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        onClick={() => router.navigate('/')}
        variant='h6'
        noWrap
        component='a'
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        CHATTER
      </Typography>
    </>
  );
};

export default Branding;
