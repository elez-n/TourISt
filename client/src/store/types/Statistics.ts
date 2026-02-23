export interface GeneralStatsDto {
  totalObjects: number;
  totalActiveObjects: number;
  totalInactiveObjects: number;
}

export interface ObjectsByMunicipalityDto {
  municipality: string;
  count: number;
}

export interface ObjectsByTypeDto {
  type: string;
  count: number;
}

export interface ObjectsByCategoryDto {
  category: string;
  count: number;
}

export interface AverageRatingRangeDto {
  range: string; 
  count: number;
}

export interface BedsByMunicipalityDto {
  municipality: string;
  totalBeds: number;
}

export interface TopReviewedDto {
  name: string;
  reviewCount: number;
  averageRating: number;
  municipality?: string; 
}

export interface TopReviewedPerMunicipalityDto {
  municipality: string;
  topObjects: Omit<TopReviewedDto, "municipality">[];
}

export interface StatisticsDto {
  generalStats: GeneralStatsDto;
  objectsByMunicipality: ObjectsByMunicipalityDto[];
  objectsByType: ObjectsByTypeDto[];
  objectsByCategory: ObjectsByCategoryDto[];
  objectsByRatingRange: AverageRatingRangeDto[];
  bedsByMunicipality: BedsByMunicipalityDto[];
  topReviewedOverall: TopReviewedDto[];
  topReviewedPerMunicipality: TopReviewedPerMunicipalityDto[];
}