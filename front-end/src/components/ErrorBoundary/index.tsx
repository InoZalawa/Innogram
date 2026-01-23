import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Aktualizujemy stan, aby następny render pokazał UI zastępcze
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Tutaj możesz wysłać błąd do Sentry/LogRocket
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload(); // Prosty sposób na "naprawę" aplikacji
  };

  render() {
    if (this.state.hasError) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 10, p: 3 }}
        >
          <Typography variant="h4" color="error" align="center" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            An unexpected error occurred in this section of the application.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={this.handleReset}>
              Refresh Page
            </Button>
          </Box>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
