import CommentBox from "../CommentBox";
import AttachmentCarousel from "../AttachmentsCarousel";
import React from "react";
import { Attachment } from "../../DTO/AttachmentDTO";

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
  }, [isLiked, contacts]); // TODO: add flexibility for text based on likes count and contacts length

  return (
    <div>
      {attachments && attachments.length > 0 && (
        <AttachmentCarousel
          attachments={attachments.map((att) => new Attachment(att, "image"))}
        />
      )}
      <div>
        <div>
          <button onClick={() => setIsLiked(!isLiked)}>like</button>
          <button>comment</button>
          <button>share</button>
        </div>
        <div>
          <button>save</button>
        </div>
      </div>
      <div className="LikedBy">{likedByText}</div>
      <div className="Description">{description}</div>

      <CommentBox author={author} />
    </div>
  );
};

export default Post;
