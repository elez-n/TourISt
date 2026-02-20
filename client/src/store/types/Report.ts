export interface ReportDto {
  objectTypeIds?: number[];   
  categoryIds?: number[];      
  municipalityIds?: number[];  
  status?: boolean;            
}

export interface ReportResultDto {
  name: string;
  objectType: string;
  category: string;
  municipality: string;
  status: "Aktivan" | "Neaktivan";
}