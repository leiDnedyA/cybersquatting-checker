import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

function LoginDialog ({ open, onClose }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Your login logic here
    console.log('Logging in with:', { username, password });
    // You can add your authentication logic here
    // For simplicity, let's just close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} variant="contained" color="primary">
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default LoginDialog;
