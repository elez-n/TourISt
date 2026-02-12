using API.Entities;
using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Dipl.Api.Data;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly TouristDbContext _context;

        public EvaluationController(TouristDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvaluation(EvaluationCreateDto dto)
        {
            if (dto.Scores == null || !dto.Scores.Any())
                return BadRequest("Nema unesenih bodova.");

            int totalPoints = dto.Scores.Sum(s => s.Points);

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => totalPoints >= c.MinPoints && totalPoints <= c.MaxPoints);

            if (category == null)
                return BadRequest("Nije moguće odrediti kategoriju za ovakve bodove.");

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

            return Ok(new
            {
                evaluation.Id,
                evaluation.TotalPoints,
                Category = category.Name,
                evaluation.CreatedAt
            });
        }
        [HttpGet("{touristObjectId}")]
        public async Task<IActionResult> GetEvaluations(int touristObjectId)
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
                        CriteriaName = s.Criteria.Name,
                        Points = s.Points
                    }).ToList()
                })
                .ToListAsync();

            if (!evals.Any())
                return NotFound("Nema evaluacija za ovaj objekat.");

            return Ok(evals);
        }
    }
}
