import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByArticle(articleId: string) {
    return this.prisma.comment.findMany({ where: { articleId } });
  }

  async create(articleId: string, userId: string, content: string) {
    return this.prisma.comment.create({ data: { articleId, userId, content } });
  }

  async update(id: string, userId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.comment.update({ where: { id }, data: { content } });
  }

  async delete(id: string, userId: string, isAdmin: boolean) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (!isAdmin && comment.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.comment.delete({ where: { id } });
  }
}
