import {Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class IsPostOwnerGuard implements CanActivate {
   constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postID = request.params.id;
    const userId = request.user?.id;
    const post = await this.prisma.post.findUnique({
      where: { id: postID },
    });
    if (!post) {
      return false;
    }
    return post.authorId === userId;
  }
}