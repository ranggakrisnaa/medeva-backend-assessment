export interface UserJWTPayload {
  id: string;
  role: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserRegisterDTO {
  fullName: string;
  email: string;
  password: string;
}

// Exclude keys from user
export function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}
