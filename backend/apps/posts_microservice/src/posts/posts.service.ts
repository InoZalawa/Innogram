import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostDTO } from './DTO/PostDTO';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      // TODO: implement proper authentication check
      return true; // Placeholder
    } catch {
      return false;
    }
  }
}

@Injectable()
export class IsPostOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postID = request.params.id;
    const userId = request.user?.id; // Assuming user is set by auth middleware
    if (!userId || !postID) {
      return false;
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postID },
    });
    if (!post) {
      return false;
    }
    return post.authorId === userId;
  }
}

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(postData: PostDTO) {
    try {
      const post = await this.prisma.post.create({
        data: {
          content: postData.content,
          authorId: postData.authorId,
          attachments: {
            create:
              postData.attachments?.map((att) => ({
                type: att.type,
                file: att.file,
              })) || [],
          },
        },
      });
      return { message: 'Post created', post };
    } catch {
      throw new Error('Failed to create post');
    }
  }

  async updatePost(postId: string, updatedData: Partial<PostDTO>) {
    try {
      const post = await this.prisma.post.update({
        where: { id: postId },
        data: {
          content: updatedData.content,
          attachments: updatedData.attachments
            ? {
                deleteMany: {},
                create: updatedData.attachments.map((att) => ({
                  type: att.type,
                  file: att.file,
                })),
              }
            : undefined,
        },
      });
      return { message: 'Post updated', post };
    } catch (error) {
      return { message: 'Failed to update post' };
    }
  }

  async getPostById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        attachments: true,
        comments: {
          include: {
            author: true,
          },
        },
        author: true,
      },
    });
  }

  async getArchivedPosts() {
    // Implement logic for archived posts if needed
    return [];
  }
}
