export class PostDTO{
  public constructor(
    readonly content: string,
    readonly authorId: string,
    readonly attachments?: Blob[], //idk what type to use here
  ) {
    this.attachments = attachments;
    this.content = content;
    this.authorId = authorId;
  }
}