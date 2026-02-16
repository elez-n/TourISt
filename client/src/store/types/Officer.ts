export interface Officer {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  municipalityId: number;
}

// Ovo je tip za odgovor nakon kreiranja službenika
export interface CreateOfficerResponse  {
  message: string;
};

// Tip za postavljanje lozinke
export interface SetPasswordDto {
  newPassword: string;
};
