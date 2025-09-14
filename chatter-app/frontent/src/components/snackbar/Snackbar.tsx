import MUISnackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useReactiveVar } from '@apollo/client/react';
import { snackVar } from '../../constants/snack';

const Snackbar = () => {
  const snack = useReactiveVar(snackVar);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    snackVar(undefined);
  };

  if (!snack) return null;

  return (
    <div>
      <MUISnackbar open={!!snack} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snack.type}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </MUISnackbar>
    </div>
  );
};

export default Snackbar;
