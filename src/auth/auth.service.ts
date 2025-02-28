import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, role: userRole },
    });

    return { message: 'User registered successfully', user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return { token };
  }
}
