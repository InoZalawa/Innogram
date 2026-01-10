export class Attachment {
  file: string;
  type: "image" | "video";
  alt?: string | "attachment";
  constructor(file: string, type: "image" | "video", alt?: string,) {
    this.file = file;
    this.type = type;
    this.alt = alt || "attachment";
  }
}
