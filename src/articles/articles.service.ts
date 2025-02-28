import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, page: number = 1, limit: number = 10) {
    const articles = await this.prisma.article.findMany({
      where: category ? { category } : {},
      take: limit,
      skip: (page - 1) * limit,
    });
    return articles;
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(data: {
    title: string;
    summary: string;
    link: string;
    category: string;
  }) {
    return this.prisma.article.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      summary: string;
      link: string;
      category: string;
    }>,
  ) {
    return this.prisma.article.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
