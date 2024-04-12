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
  const [isOpen, setIsOpen] = useState(open);

  const handleLogin = async () => {
      try {
        const response = await fetch('/login/password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert('Login failed. Please check your username and password.');
          } else {
            alert('An error occurred. Please try again later.');
          }
          throw new Error('Login failed');
        }

        setIsOpen(false);

        onClose(); // Close the dialog if login is successful
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

  return (
    <Dialog open={isOpen} onClose={onClose}>
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
