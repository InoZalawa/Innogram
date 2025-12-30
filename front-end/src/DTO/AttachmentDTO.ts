export class Attachment {
  file: string;
  type: "image" | "video";
  alt?: string | "attachment";
  constructor(file: string, type: "image" | "video") {
    this.file = file;
    this.type = type;
  }
}
