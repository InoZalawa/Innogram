import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Stack, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const PostForm: React.FC = () => {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await axios.post("/posts/create", {
      content,
      attachments,
    });
    console.log(result.data);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, maxWidth: 600, margin: "auto", mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            aria-label="Post content"
          />
          <Stack direction="row" gap={1}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              Upload files
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => console.log(e.target.files)}
                aria-label="Upload files"
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!content.trim()}
              size="small"
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default PostForm;
