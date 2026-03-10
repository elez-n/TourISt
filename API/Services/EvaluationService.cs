using API.DTOs;
using API.Entities;
using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class EvaluationService : IEvaluationService
    {
        private readonly TouristDbContext _context;

        public EvaluationService(TouristDbContext context)
        {
            _context = context;
        }

        public async Task<EvaluationResultDto> CreateEvaluationAsync(EvaluationCreateDto dto)
        {
            if (dto.Scores == null || !dto.Scores.Any())
                throw new Exception("Nema unesenih bodova.");

            int totalPoints = dto.Scores.Sum(s => s.Points);

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => totalPoints >= c.MinPoints && totalPoints <= c.MaxPoints);

            if (category == null)
                throw new Exception("Nije moguće odrediti kategoriju za ovakve bodove.");

            var evaluation = new Evaluation
            {
                TouristObjectId = dto.TouristObjectId,
                UserId = dto.UserId,
                TotalPoints = totalPoints,
                CategoryId = category.Id,
                CreatedAt = DateTime.Now
            };

            _context.Evaluations.Add(evaluation);
            await _context.SaveChangesAsync();

            foreach (var scoreDto in dto.Scores)
            {
                var score = new EvaluationScore
                {
                    EvaluationId = evaluation.Id,
                    CriteriaId = scoreDto.CriteriaId,
                    Points = scoreDto.Points
                };
                _context.EvaluationScores.Add(score);
            }

            await _context.SaveChangesAsync();

            var obj = await _context.TouristObjects.FindAsync(dto.TouristObjectId);
            if (obj != null)
            {
                obj.CategoryId = category.Id;
                await _context.SaveChangesAsync();
            }

            return new EvaluationResultDto
            {
                Id = evaluation.Id,
                TotalPoints = evaluation.TotalPoints,
                CategoryName = category.Name,
                CreatedAt = evaluation.CreatedAt
            };
        }

        public async Task<List<EvaluationDto>> GetEvaluationsAsync(int touristObjectId)
        {
            var evals = await _context.Evaluations
                .Where(e => e.TouristObjectId == touristObjectId)
                .Select(e => new EvaluationDto
                {
                    Id = e.Id,
                    TotalPoints = e.TotalPoints,
                    CategoryId = e.CategoryId,
                    CategoryName = e.Category.Name,
                    CreatedAt = e.CreatedAt,
                    OfficerFullName = e.Officer.Profile.FirstName + " " + e.Officer.Profile.LastName,
                    Scores = e.Scores.Select(s => new EvaluationScoreDto
                    {
                        CriteriaId = s.CriteriaId,
                        Points = s.Points
                    }).ToList()
                })
                .ToListAsync();

            return evals;
        }

        public async Task<List<CriteriaDto>> GetCriteriaAsync()
        {
            return await _context.Criterias
                .Select(c => new CriteriaDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    MaxPoints = c.MaxPoints,
                    Description = c.Description
                })
                .ToListAsync();
        }
    }
}