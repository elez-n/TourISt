export interface Officer {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  municipalityId: number;
}

export interface CreateOfficerResponse  {
  message: string;
};

export interface SetPasswordDto {
  newPassword: string;
};
