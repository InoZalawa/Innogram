import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostNotArchivedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postID = request.params.id;
    if (!postID) {
      return false;
    }
    const userId = request.user?.id; // Assuming user is set by auth middleware
    const authorId = await this.prisma.post.findUnique({
      where: { id: postID },
      select: { authorId: true },
    }).then(post => post?.authorId);
    if (userId === authorId) {
      return true; // Author can always access their own posts
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postID },
    });
    if (!post) {
      return false;
    }
    return post.isArchived;
  }
}