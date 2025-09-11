import { Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import router from '../../Routes';

const MobileBranding = () => {
  return (
    <>
      <ForumIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
      <Typography
        onClick={() => router.navigate('/')}
        variant='h5'
        noWrap
        component='a'
        sx={{
          mr: 2,
          display: { xs: 'flex', md: 'none' },
          flexGrow: 1,
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

export default MobileBranding;
