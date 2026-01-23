import React, { useState } from "react";
import axios from "axios";

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
    <form onSubmit={handleSubmit} noValidate>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setAttachments(Array.from(e.target.files || []))}
      />
      <button type="submit">Post</button>
    </form>
  );
};
export default PostForm;
