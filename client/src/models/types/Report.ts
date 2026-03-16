export interface ReportDto {
  objectTypeIds?: number[];   
  categoryIds?: number[];      
  municipalityIds?: number[];  
  status?: boolean;  
  sort?: string;          
}

export interface ReportResultDto {
  name: string;
  objectType: string;
  category: string;
  municipality: string;
  status: "Aktivan" | "Neaktivan";
}