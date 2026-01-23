import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDTO } from './AttachmentDTO';
import { CommentDTO } from './CommentDTO';

export class PostDTO {
  @IsNotEmpty()
  @IsString()
  readonly postId: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly authorId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDTO)
  readonly attachments?: AttachmentDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDTO)
  readonly comments?: CommentDTO[];

  public constructor(
    postId: string,
    content: string,
    authorId: string,
    attachments?: AttachmentDTO[],
    comments?: CommentDTO[]
  ) {
    this.postId = postId;
    this.content = content;
    this.authorId = authorId;
    this.attachments = attachments;
    this.comments = comments;
  }
}
