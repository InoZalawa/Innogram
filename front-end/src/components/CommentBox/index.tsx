import axios from "axios";
import EmojiPeaker from "emoji-picker-react";
import { useState } from "react";

interface CommentBoxProps {
  author: string;
};

const CommentBox: React.FC<CommentBoxProps> = ({author}) => {

  const [comment, setComment] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = axios.post("/posts/create", {
      author: author,
    });
  } catch (err) {
    console.error("Comment submission failed.");
  }

}

  
  return (
    <div>
      <button onClick={() =>setIsEmojiPickerOpen(!isEmojiPickerOpen)}>😊</button>
        <form onSubmit={handleSubmit} noValidate>
        <textarea  value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">Post</button>

        {isEmojiPickerOpen && (
          <div>
            {<EmojiPeaker 
            onEmojiClick={(e) => setComment(comment + e.emoji)}
            />}
          </div>
        )}
      </form>
    </div>
  );
}

export default CommentBox;
