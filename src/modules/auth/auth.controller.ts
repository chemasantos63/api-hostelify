import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.signup(signupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.sigin(signinDto);
  }
}
