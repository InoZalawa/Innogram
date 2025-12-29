import CommentBox from "../CommentBox";
import React from "react";

interface PostProps {
  author: string;
  contacts?: string[];
  description?: string;
};
const Post : React.FC<PostProps> = ({author, contacts,description}) => {
  const [isLiked, setIsLiked] = React.useState(false);  


  const likedByText = "temp" //TODO: replace with generating text depeding on who liked the post author friends, amount of likes, etc.
  return (
    <div>
      <img src="https://via.placeholder.com/150" alt="Post Image" />
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
      
      <CommentBox author={author}/>

    </div>
  );
}

export default Post;
