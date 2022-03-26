import { RoleName } from '../enum/group-name.enum';
import { PermissionName } from '../enum/permission-name.enum';

export const usersObject = [
  {
    firstName: 'Ashik',
    lastName: 'Chin2',
    email: 'admin@shakotracker.com',
    phone: '01717150423',
    password: 'admin01',
    group: RoleName.SUPER_ADMIN,
    permission: PermissionName.SUPER_ADMIN,
  },
  {
    firstName: 'Tahrim',
    lastName: 'Ahmed Miad',
    email: 'tamiad1618@gmail.com',
    phone: '01733781618',
    password: 'miad1234',
    group: RoleName.SUPER_ADMIN,
    permission: PermissionName.SUPER_ADMIN,
  },
  {
    firstName: 'Tahrim',
    lastName: 'Ahmed Miad',
    email: 'pranhinmiad@gmail.com',
    phone: '01551810867',
    password: 'miad1234',
    group: RoleName.ADMIN,
    permission: PermissionName.ADMIN,
  },
  {
    firstName: 'Tahrim',
    lastName: 'Ahmed Miad',
    email: 'pranhinmiad30@gmail.com',
    phone: '01736239533',
    password: 'miad1234',
    group: RoleName.MANAGEMENT,
    permission: PermissionName.MANAGEMENT,
  },
];
