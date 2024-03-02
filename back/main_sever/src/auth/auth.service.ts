import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ENV_AUTH_SALT2024_KEY,
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // todo bcript를 사용하자 단 너무 느게리게 사용하지 말고
  // salt를 잘 사용하고 주기적으로 salt를 바꿔주자

  async authenticateWithEmailAndPassword(user: Pick<User, 'email' | 'password'>) {
    /**
     * 1. 사용자가 존재하는지 확인 (email)
     * 2. 비밀번호가 맞는지 확인
     * 3. 모두 통과되면 찾은 상용자 정보 반환
     */
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    /**
     * 파라미터
     *
     * 1) 입력된 비밀번호
     * 2) 기존 해시 (hash) -> 사용자 정보에 저장돼있는 hash
     */

    const passOk = await bcrypt.compare(
      `${user.password}${this.configService.get<string>(ENV_AUTH_SALT2024_KEY)}`,
      existingUser.password,
    );
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }
  loginUser(user: Pick<User, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async loginWithEmail(user: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  /**
   * jwt Payload에 들어갈 정보
   *
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   *
   * {email: string, id: number}
   */
  signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      // seconds
      expiresIn: isRefreshToken ? 3600 : 300, // 토큰 타입에 따라 기간을 다르게 설정
    });
  }

  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(
      `${user.password}${this.configService.get<string>(ENV_AUTH_SALT2024_KEY)}`,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    );

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
