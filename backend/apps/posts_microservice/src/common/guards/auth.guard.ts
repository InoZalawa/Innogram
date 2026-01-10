import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
//import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      // TODO: implement proper authentication check
      return true; // Placeholder
    } catch {
      return false;
    }
  }
}