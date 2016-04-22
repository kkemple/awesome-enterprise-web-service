module.exports = {
  user: [
    'users:read:current',
    'users:write:current',
  ],

  admin: [
    'users:read',
    'users:write',
    'users:create',
    'metrics:read',
  ],

  super: [
    'users:read',
    'users:write',
    'users:create',
    'users:delete',
    'metrics:read',
  ],
}
