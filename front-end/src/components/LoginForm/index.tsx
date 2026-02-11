import { useState } from "react";
import { Input } from "../../components";
import {
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement login logic here
  };
  //sthrow new Error("Test error for ErrorBoundary");
  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Log in!
        </Typography>

        <Box
          onSubmit={handleSubmit}
          noValidate
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Input
            label="Username/Email"
            name="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            errors={[]}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errors={[]}
            required
          />
          <Button type="submit" variant="contained" fullWidth size="large">
            Submit
          </Button>
        </Box>

        <Divider />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or log in with Google account!
          </Typography>
          <IconButton
            aria-label="Login with Google"
            color="primary"
            size="large"
          >
            <GoogleIcon />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Don't have account yet?
          </Typography>
          <Link href="#" underline="hover" variant="body2">
            Sign up here
          </Link>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default LoginForm;
