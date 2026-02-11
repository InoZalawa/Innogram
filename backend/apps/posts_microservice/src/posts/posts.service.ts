import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostDTO } from './DTO/PostDTO';
import { CommentDTO } from './DTO/CommentDTO';
import logger from '../utils/logger';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(postData: PostDTO) {
    try {
      return await this.prisma.post.create({
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
        }, // Usunięto zbędny znak 'f'
      });
    } catch (err) {
      logger.error('Error creating post:', err);
      throw new InternalServerErrorException('Failed to create post!');
    }
  }

  async updatePost(postId: string, updatedData: Partial<PostDTO>) {
    const currentPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    try {
      return await this.prisma.post.update({
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
    } catch (err) {
      logger.error('Error updating post:', err);
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        attachments: true,
        comments: {
          include: { author: true },
        },
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async deletePost(id: string) {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return { message: 'Post deleted successfully' };
    } catch (err) {
      logger.error('Error deleting post:', err);
      throw new NotFoundException(
        `Post with ID ${id} not found or already deleted`
      );
    }
  }

  async archivePost(id: string) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: { isArchived: true },
      });
    } catch (err) {
      logger.error('Error archiving post:', err);
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async addComment(postId: string, commentData: CommentDTO) {
    try {
      return await this.prisma.comment.create({
        data: {
          content: commentData.content,
          authorId: commentData.authorId,
          postId: postId,
        },
      });
    } catch (err) {
      logger.error('Error adding comment:', err);
      throw new BadRequestException(
        'Could not add comment. Check if Post and Author exist.'
      );
    }
  }
}
