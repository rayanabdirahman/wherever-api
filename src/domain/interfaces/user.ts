import { UserRolesEnum } from '../enums/user';

export interface UserModel {
  _id: string | Record<string, unknown>;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRolesEnum[];
}

export interface JwtPayload {
  user: UserModel;
}
