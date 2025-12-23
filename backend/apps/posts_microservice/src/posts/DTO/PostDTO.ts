export class CommentDTO{
  public constructor(
    readonly postId: string,
    readonly commentId: string,
    readonly content: string,
    readonly authorId: string,
  ) {
    this.postId = postId;
    this.commentId = commentId;
    this.content = content;
    this.authorId = authorId;
  }
}

export class PostDTO{
  public constructor(
    readonly postId: string,
    readonly content: string,
    readonly authorId: string,
    readonly attachments?: Blob[], //idk what type to use here
    readonly comments?: CommentDTO[]
  ) {
    this.postId = postId;
    this.attachments = attachments;
    this.content = content;
    this.authorId = authorId;
    this.comments = comments;
  }
}