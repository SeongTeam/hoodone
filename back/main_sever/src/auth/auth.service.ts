import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENV_AUTH_SALT2024_KEY, ENV_HASH_ROUNDS_KEY, ENV_JWT_SECRET_KEY,} from 'src/common/const/env-keys.const';
import { UserModel } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Header에서 토큰 추출
   *
   * {authorization: 'Basic {token}'} 처음에 로그인할 떄 사용 또는
   * {authorization: 'Bearer {token}'} access 또는 refresh 토큰 일때 사용
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    // 'Basic {token}'  split 결과 =>  [Basic, {token}]
    // 'Bearer {token}' split 결고 => [Bearer, {token}]
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    // splitToken의 길이는 항상 2 ||
    // prefix는 'Bearer'또는 'Basic' 인데 splitToken[0]은 아닐 수 있어서
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰 또는 Bearer, Basic이 없습니다.');
    }

    const token = splitToken[1];

    return token;
  }
  /**
   * Basic al;sdkfjoiasdjlzkxcjvsdf와 같은 형태의 header decode
  
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  /**
   * 토큰 검증
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }
  /**
   * refresh 토큰을 매게변수로 받아서 새로운 access 토큰을 출력
   *
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      complete: true,
    });

    /**
     * sub: id
     * email: email,
     * type: 'access' | 'refresh'
     */
    if (decoded.payload.type !== 'refresh') {
  


      throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다!');
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
  // todo bcript를 사용하자 단 너무 느게리게 사용하지 말고
  // salt를 잘 사용하고 주기적으로 salt를 바꿔주자
  async authenticateWithEmailAndPassword(user: Pick<UserModel, 'email' | 'password'>) {
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
  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
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
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
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
