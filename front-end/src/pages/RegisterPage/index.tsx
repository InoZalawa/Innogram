import { RegisterForm } from "../../components";
import { Container } from "@mui/material";

const RegisterPage: React.FC = () => {
  return (
    <Container component="main" sx={{ py: 4 }}>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
