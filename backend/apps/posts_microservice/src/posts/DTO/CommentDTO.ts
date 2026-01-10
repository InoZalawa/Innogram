import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDTO {
  @IsNotEmpty()
  @IsString()
  readonly postId: string;

  @IsNotEmpty()
  @IsString()
  readonly commentId: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly authorId: string;

  public constructor(
    postId: string,
    commentId: string,
    content: string,
    authorId: string
  ) {
    this.postId = postId;
    this.commentId = commentId;
    this.content = content;
    this.authorId = authorId;
  }
}
