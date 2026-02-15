export interface EvaluationScoreDto {
  criteriaId: number;
  criteriaName: string;
  points: number;
}

export interface EvaluationDto {
  id: number;
  totalPoints: number;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  officerFullName: string;
  scores: EvaluationScoreDto[];
}

export interface CreateEvaluationDto {
  touristObjectId: number;
  userId: string; // GUID iz Redux-a
  scores: {
    criteriaId: number;
    points: number;
  }[];
}
