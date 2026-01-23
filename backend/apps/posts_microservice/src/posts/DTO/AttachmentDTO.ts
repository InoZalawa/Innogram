import { IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDTO {
  @IsNotEmpty()
  @IsString()
  attachmentId: string;

  @IsNotEmpty()
  @IsString()
  type: string; // "image" or "video"

  @IsNotEmpty()
  @IsString()
  file: string; // URL or path

  public constructor(attachmentId: string, type: string, file: string) {
    this.attachmentId = attachmentId;
    this.type = type;
    this.file = file;
  }
}
