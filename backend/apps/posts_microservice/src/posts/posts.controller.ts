import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDTO } from './DTO/PostDTO';
import { CommentDTO } from './DTO/CommentDTO';
import { HttpExceptionFilter } from '../common/filters/http.filter';
import { PostNotArchivedGuard as IsArchived } from '../common/guards/post-not-archived.guard';
import { HttpInterceptor } from '../common/interceptors/http.interceptor';
//import { AuthGuard as IsLoggedInGuard } from '../common/guards/auth.guard';
//import { IsAuthorGuard as IsPostOwnerGuard } from '../common/guards/is-author.guard';

@Controller('posts')
@UseInterceptors(HttpInterceptor)
@UseFilters(HttpExceptionFilter)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  //@UseGuards(IsLoggedInGuard)
  async createPost(@Body() postData: PostDTO) {
    return this.postsService.createPost(postData);
  }

  @Get(':id')
  @UseGuards(IsArchived)
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id/edit')
  //@UseGuards(IsLoggedInGuard, IsPostOwnerGuard)
  async editPostById(
    @Param('id') id: string,
    @Body() updatedData: Partial<PostDTO>
  ) {
    return this.postsService.updatePost(id, updatedData);
  }

  @Delete(':id/delete')
  //@UseGuards(IsLoggedInGuard, IsPostOwnerGuard)
  async deletePostById(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Patch(':id/archive')
  //@UseGuards(IsLoggedInGuard, IsPostOwnerGuard)
  async archivePostById(@Param('id') id: string) {
    return this.postsService.archivePost(id);
  }

  @Patch(':id/AddComment')
  @UseGuards(IsArchived /* IsLoggedInGuard */)
  async addComment(@Param('id') id: string, @Body() commentData: CommentDTO) {
    return this.postsService.addComment(id, commentData);
  }

  @Get('archived')
  async getArchivedPosts() {
    // return this.postsService.getArchivedPosts();
  }
}
