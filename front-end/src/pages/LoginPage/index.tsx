import { LoginForm } from "../../components";
import { Container } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Container component="main" sx={{ py: 4 }}>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
