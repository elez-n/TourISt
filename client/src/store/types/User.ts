export interface UserDto {
  username: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  userId?: string;
}

export interface UserInfoDto {
  id: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string | null;
  municipalityName?: string | null;
}

