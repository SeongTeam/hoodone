import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto): Promise<void> {
    return this.authService.signUp(registerUserDto)
  }
}
