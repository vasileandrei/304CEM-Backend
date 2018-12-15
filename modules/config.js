// Account configuration -- Account access

/* eslint-disable no-bitwise */
const config = module.exports;

const userRoles = {
  guest: 1, // ...001
  user: 2, // ...010
  admin: 4, // ...100
};

config.accessLevels = {
  guest: userRoles.guest | userRoles.user | userRoles.admin, // 7
  user: userRoles.user | userRoles.admin, // 6
  admin: userRoles.admin, // 4
};
