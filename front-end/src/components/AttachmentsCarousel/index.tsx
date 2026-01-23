import React from "react";
import { Attachment } from "../../DTO/AttachmentDTO";

interface AttachmentCarouselProps {
  attachments?: Attachment[];
}

const AttachmentCarousel: React.FC<AttachmentCarouselProps> = ({
  attachments,
}) => {
  const nextAttachment = () => {
    setCurrentIndex((prev) => (prev + 1) % (attachments?.length || 0));
  };
  const prevAttachment = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (attachments?.length || 0)) % (attachments?.length || 0),
    );
  };
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <div className="AttachmentCarousel">
      <button onClick={prevAttachment}>‹</button>
      <div className="AttachmentsContainer">
        {attachments && attachments[currentIndex]?.type === "video" && (
          <video controls>
            <source
              src={attachments[currentIndex]?.file || "attachment didn't found"}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {attachments && attachments[currentIndex]?.type === "image" && (
          <img
            src={attachments[currentIndex]?.file || "attachment didn't found"}
            alt={attachments[currentIndex]?.alt || "attachment"}
          />
        )}
      </div>
      <button onClick={nextAttachment}>›</button>
    </div>
  );
};
export default AttachmentCarousel;
