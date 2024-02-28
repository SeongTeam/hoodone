import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto'
import { UserRepository } from 'src/users/user.repository'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async signUp(registerUserDto: RegisterUserDto): Promise<void> {
    return this.userRepository.createUser(registerUserDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto
    const user = await this.userRepository.findOneBy({ email: email })

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 ( Secret + Payload )
      const payload = { email }
      const accessToken = await this.jwtService.sign(payload)

      return { accessToken }
    } else {
      throw new UnauthorizedException('login failed')
    }
  }
}
