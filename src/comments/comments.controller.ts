import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':articleId')
  findByArticle(@Param('articleId') articleId: string) {
    return this.commentsService.findByArticle(articleId);
  }

  @Post()
  @UseGuards(JwtAuthGuard) // ✅ Users must be logged in to comment
  create(
    @Body() { articleId, content }: { articleId: string; content: string },
    @Request() req,
  ) {
    return this.commentsService.create(articleId, req.user.id, content);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // ✅ Only the comment owner can edit
  update(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.commentsService.update(id, req.user.id, content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.commentsService.delete(
      id,
      req.user.id,
      req.user.role === 'ADMIN',
    );
  }
}
