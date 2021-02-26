import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { RoleType } from 'src/modules/role/roletype.enum';
import { UserRepository } from '../user/user.repository';
import { User } from './../user/user.entity';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    return this.userRepository.signup(signupDto);
  }

  async sigin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;
    const user: User = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User does not exists`);
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
