import CommentBox from "../CommentBox";
import AttachmentCarousel from "../AttachmentsCarousel";
import React from "react";
import { Attachment } from "../../DTO/AttachmentDTO";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface PostProps {
  author: string;
  contacts?: string[];
  description?: string;
  attachments?: string[];
  likes?: number;
}

const Post: React.FC<PostProps> = ({
  author,
  contacts,
  description,
  attachments,
  likes,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likedByText, setLikedByText] = React.useState("");
  React.useEffect(() => {
    if (isLiked) {
      setLikedByText(
        `Liked by You${contacts && contacts.length > 0 ? ` and ${likes} others` : ""}`,
      );
    } else {
      setLikedByText(
        contacts && contacts.length > 0
          ? `Liked by ${contacts[0]}${contacts.length > 1 ? ` and ${likes} others` : ""}`
          : "",
      );
    }
  }, [isLiked, contacts]);

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mb: 3 }}>
      <CardContent>
        {attachments && attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <AttachmentCarousel
              attachments={attachments.map(
                (att) => new Attachment(att, "image"),
              )}
            />
          </Box>
        )}

        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction="row" spacing={1}>
              <Tooltip title="Like">
                <IconButton
                  onClick={() => setIsLiked(!isLiked)}
                  aria-label={isLiked ? "Unlike" : "Like"}
                  size="small"
                >
                  {isLiked ? (
                    <FavoriteIcon sx={{ color: "error.main" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Comment">
                <IconButton aria-label="Comment" size="small">
                  <ChatBubbleOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton aria-label="Share" size="small">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <Tooltip title="Save">
              <IconButton aria-label="Save" size="small">
                <BookmarkBorderIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {likedByText && (
            <Typography variant="body2" color="text.secondary">
              {likedByText}
            </Typography>
          )}

          <Divider />

          {description && (
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {description}
            </Typography>
          )}

          <Divider />

          <Box>
            <CommentBox author={author} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Post;
