// import { PrismaClient } from '@prisma/client';

import { PostDTO } from "./DTO/PostDTO";
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import prisma from '../../../auth_microservice/db/prismaClient';

@Injectable()
export class IsLoggedInGuard implements CanActivate { //in order to create post(check if user is logged in)
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try{
    // TODO: implement proper authentication check
    }
    catch{
      return false;
    }
    return true;
  }
}


@Injectable() 
export class IsPostOwnerGuard implements CanActivate { //in order to edit post (check if user is author)
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postID = request.params.id;
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
    });
    if (!user || !postID) {
      return false;
    }
    const post = await prisma.post.findUnique({
      where: { id: postID },
    });
    if (!post) {
      return false;
    }
    if (post.authorId !== user.id) {
      return false;
    }
    return true;
  }
}

export const handleCreatePost = async (postData: PostDTO) => {
  try {
    // Logic to create a post in the database
    await prisma.post.upsert({
      data: {
        content: postData.content,
        authorId: postData.authorId,
        attachments: postData.attachments,
        comments: [],
      },
    });
  } catch (error) {
    throw new Error('Failed to create post');
    return { message: 'Failed to create post' };
  }
  return { message: 'Post created' };
}

export const handleUpdatePost = async (postId: string, updatedData: Partial<PostDTO>) => {
  try {    
    await prisma.post.update({
      where: { id: postId },
      data: updatedData,
    });

    return { message: 'Post updated' };
  } catch () {
    return { message: 'Failed to update post' };
  }
}