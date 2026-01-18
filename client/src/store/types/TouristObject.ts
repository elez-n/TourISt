import type { AdditionalService } from "./AdditionalService";
import type { Photograph } from "./Photograph";
import type { Review } from "./Review";

export interface TouristObject {
  id: number;
  name: string;
  objectType: string;
  status: boolean;
  address: string;
  coordinate1: number;
  coordinate2: number;
  contactPhone: string;
  contactEmail: string;
  numberOfUnits: number;
  numberOfBeds: number;
  description?: string;
  owner: string;
  featured: boolean;
  category: string;
  municipality: string;
  additionalServices?: AdditionalService[];
  photographs?: Photograph[];
  reviews?: Review[];
}

export interface TouristObjectDto {
  id: number;
  name: string;
  objectTypeName: string;
  status: boolean;
  address: string;
  coordinate1: number;
  coordinate2: number;
  contactPhone: string;
  contactEmail: string;
  numberOfUnits: number;
  numberOfBeds: number;
  description: string;
  owner: string;
  featured: boolean;
  categoryName: string;
  municipalityName: string;
  additionalServices: string[];
  photographs: string[];
}

