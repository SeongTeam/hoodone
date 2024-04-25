import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../const/role.type';

export const ROLES_KEY = 'user_roles';

// ex) @Roles(RolesEnum.ADMIN)
export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
