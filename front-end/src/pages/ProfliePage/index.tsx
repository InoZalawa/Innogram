import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Box,
} from "@mui/material";

const ProfilePage: React.FC = () => {
  return (
    <Container component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              User Profile
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Stack spacing={1}>
                <Typography variant="h6">Your Name</Typography>
                <Typography variant="body2" color="text.secondary">
                  @username
                </Typography>
              </Stack>
            </Box>
            <Typography variant="body2">
              This is your profile bio section. Add some information about
              yourself here!
            </Typography>
            <Stack direction="row" gap={2}>
              <Button variant="contained">Edit Profile</Button>
              <Button variant="outlined">Settings</Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profile Stats
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="h6">42</Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">128</Typography>
              <Typography variant="body2" color="text.secondary">
                Followers
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">64</Typography>
              <Typography variant="body2" color="text.secondary">
                Following
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
