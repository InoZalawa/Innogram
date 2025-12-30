import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  IsLoggedInGuard,
  IsPostOwnerGuard,
  PostsService,
} from './posts.service';
import { PostDTO } from './DTO/PostDTO';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @UseGuards(IsLoggedInGuard)
  async createPost(@Body() postData: PostDTO) {
    return this.postsService.createPost(postData);
  }

  @Get('archived')
  async getArchivedPosts() {
    return this.postsService.getArchivedPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post(':id/edit')
  @UseGuards(IsLoggedInGuard, IsPostOwnerGuard)
  async editPostById(
    @Param('id') id: string,
    @Body() updatedData: Partial<PostDTO>
  ) {
    return this.postsService.updatePost(id, updatedData);
  }
}
