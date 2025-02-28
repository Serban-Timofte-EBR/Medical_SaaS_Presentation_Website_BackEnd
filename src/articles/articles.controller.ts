import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  SetMetadata,
  Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.middleware';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('page') page?: number) {
    return this.articlesService.findAll(category, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Ensures the user is authenticated & authorized
  @SetMetadata('role', 'ADMIN')
  create(
    @Body()
    data: {
      title: string;
      summary: string;
      link: string;
      category: string;
    },
  ) {
    return this.articlesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'ADMIN')
  update(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      title: string;
      summary: string;
      link: string;
      category: string;
    }>,
  ) {
    return this.articlesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'ADMIN')
  delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
