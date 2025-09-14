import { Box, Button } from '@mui/material';
import type { Page } from '../../interfaces/page.interface';
import router from '../Routes';

interface NavigationProps {
  pages: Page[];
}

const Navigation = ({ pages }: NavigationProps) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page.path}
          sx={{ my: 2, color: 'white', display: 'block' }}
          onClick={() => router.navigate(page.path)}
        >
          {page.title}
        </Button>
      ))}
    </Box>
  );
};

export default Navigation;
