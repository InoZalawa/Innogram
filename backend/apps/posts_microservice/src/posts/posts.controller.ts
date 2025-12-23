import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { IsLoggedInGuard, IsPostOwnerGuard } from './posts.service';
import { PostDTO } from './DTO/PostDTO';
import { handleCreatePost } from './posts.service';
@Controller('posts')
export class PostsController {

  @Get('create')
  @UseGuards(IsLoggedInGuard)
  async createPost(@Param() postData: PostDTO) {
    await handleCreatePost(postData);
    return { message: 'Post created' };
  }

  @Get('archived')
  getArchivedPosts() {
    return { message: 'Archived posts' };
  }

  @Get(':id')
  getPostById() {
    return { message: 'View post by ID' };
  }

  @Post(':id/edit')
  @UseGuards(IsLoggedInGuard, IsPostOwnerGuard)
  editPostById() {
    return { message: 'Edit post by ID' };
  }
} 