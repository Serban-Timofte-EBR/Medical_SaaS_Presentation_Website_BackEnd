import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.middleware';
import { SetMetadata } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; role?: string },
  ) {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'ADMIN') // ✅ Only ADMINs can create another ADMIN
  async registerAdmin(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password, 'ADMIN');
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
