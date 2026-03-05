export interface RegistrationRequestDto {
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;
  objectName: string;
  objectTypeId: number;
  municipalityId: number;
  address: string;
}

export interface GetRegistrationRequestDto {
  id: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;
  objectName: string;
  objectType: string;
  municipality: string;
  address: string;
  status: string;
  createdAt: string; 
}

export interface UpdateStatusDto {
  status: string;
}