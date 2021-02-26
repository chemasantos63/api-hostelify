import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from './../../../config/config.keys';
import { ConfigService } from './../../../config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from '../jwt-payload.interface';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UserRepository } from './../../../modules/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, `myJwtStrategy`) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this.userRepository.findOne({
      where: { username, status: 'ACTIVE' },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
