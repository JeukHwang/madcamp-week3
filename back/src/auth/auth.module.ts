import { Module } from '@nestjs/common';
import { GoogleStrategy } from 'src/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
