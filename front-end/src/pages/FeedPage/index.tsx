import { Container, Stack } from "@mui/material";
import { PostForm, Post } from "../../components";

const FeedPage: React.FC = () => {
  const samplePosts = [
    {
      author: "Ziutek",
      description: "Ziutek posting again!",
      likes: 42,
      contacts: ["Zbyszek", "Ziutkowna"],
    },
    {
      author: "Zbychu",
      description: "Hello world from Zbychu.",
      likes: 15,
      contacts: [],
    },
  ];

  return (
    <Container component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PostForm />
        {samplePosts.map((post, index) => (
          <Post
            key={index}
            author={post.author}
            description={post.description}
            likes={post.likes}
            contacts={post.contacts}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default FeedPage;
