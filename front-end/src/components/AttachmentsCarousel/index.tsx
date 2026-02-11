import React from "react";
import { Attachment } from "../../DTO/AttachmentDTO";
import {
  Box,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  Paper,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
interface AttachmentCarouselProps {
  attachments?: Attachment[];
}

const AttachmentCarousel: React.FC<AttachmentCarouselProps> = ({
  attachments,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // if attachmetns is undefined or empty, don't render the carousel
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const current = attachments[currentIndex] || {
    type: "image",
    file: "",
    alt: "",
  };

  const nextAttachment = () => {
    setCurrentIndex((prev) => (prev + 1) % attachments.length);
  };

  const prevAttachment = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + attachments.length) % attachments.length,
    );
  };

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === attachments.length - 1;

  return (
    <Paper elevation={1} sx={{ overflow: "hidden", borderRadius: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ width: "100%" }}
      >
        <Tooltip title="Previous">
          <span>
            <IconButton
              onClick={prevAttachment}
              disabled={isFirstSlide && attachments.length === 1}
              aria-label="Previous attachment"
              size="small"
            >
              <NavigateBeforeIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
            overflow: "hidden",
            height: 400,
          }}
        >
          <CardMedia
            component={current.type === "video" ? "video" : "img"}
            controls={current.type === "video"}
            image={current.file}
            alt={current.alt || "attachment"}
            sx={{
              maxHeight: "100%",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        <Tooltip title="Next">
          <span>
            <IconButton
              onClick={nextAttachment}
              disabled={isLastSlide && attachments.length === 1}
              aria-label="Next attachment"
              size="small"
            >
              <NavigateNextIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      {attachments.length > 1 && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            p: 1,
            bgcolor: "#f5f5f5",
          }}
        >
          {currentIndex + 1} / {attachments.length}
        </Typography>
      )}
    </Paper>
  );
};
export default AttachmentCarousel;
