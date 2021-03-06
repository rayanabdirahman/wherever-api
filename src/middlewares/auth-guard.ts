/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import expressJWT from 'express-jwt';
import config from '../config';
import { UserRolesEnum } from '../domain/enums/user';
import { JwtPayload } from '../domain/interfaces/user';

const rejectRequestToAdminRoutes = (
  req: Request,
  payload: JwtPayload,
  done: (err: any, revoked?: boolean) => void
): void => {
  // prevent buyers from accessing admin routes
  // TODO: make sure buyers are only restricted from admin routes!!
  if (payload.user.role.includes(UserRolesEnum.BUYER)) {
    done(null, true);
  }

  done(null);
};

const AuthGuard = (): any =>
  expressJWT({
    secret: `${config.APP_JWT_SECRET}`,
    algorithms: ['HS256'],
    isRevoked: rejectRequestToAdminRoutes
  }).unless({
    path: [
      `${config.API_URL}/accounts/signup`,
      `${config.API_URL}/accounts/signin`,
      {
        url: /\/api\/v1\/users(.*)/,
        methods: ['GET', 'OPTIONS']
      },
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ['GET', 'OPTIONS']
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ['GET', 'OPTIONS']
      }
    ]
  });

export default AuthGuard;
