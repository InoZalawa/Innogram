import axios from "axios";
import EmojiPeaker from "emoji-picker-react";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

interface CommentBoxProps {
  author: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ author }) => {
  const [comment, setComment] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // try {
    //   const response = axios.post("/comments/create", {
    //     author: author,
    //     content: comment
    //   });
    // } catch (err) {
    //   console.error("Comment submission failed.");
    // }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: "100%", position: "relative" }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="flex-start" gap={1}>
          <Tooltip title="Add emoji">
            <IconButton
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              color={isEmojiPickerOpen ? "primary" : "default"}
              aria-label="Add emoji"
              size="small"
            >
              <EmojiEmotionsIcon />
            </IconButton>
          </Tooltip>
          <TextField
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="Comment text"
          />
        </Stack>

        {isEmojiPickerOpen && (
          <Box sx={{ position: "relative", zIndex: 10 }}>
            <EmojiPeaker onEmojiClick={(e) => setComment(comment + e.emoji)} />
          </Box>
        )}

        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={!comment.trim()}
            size="small"
          >
            Post
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CommentBox;
