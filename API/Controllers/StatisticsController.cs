using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using Dipl.Api.Data;
using API.Extensions;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly TouristDbContext _context;

        public StatisticsController(TouristDbContext context)
        {
            _context = context;
        }

        // GET: api/statistics/overview
        [HttpGet("overview")]
        public async Task<ActionResult> GetStatistics()
        {
            var userId = User.GetUserId();
            var currentUser = await _context.Users
                .Include(u => u.OfficerProfile) // prvo samo OfficerProfile
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (currentUser == null) return Unauthorized();

            bool isAdmin = currentUser.Role == "Admin";
            int? municipalityId = null;

            if (!isAdmin)
            {
                if (currentUser.OfficerProfile == null)
                    return Unauthorized(); 

                municipalityId = currentUser.OfficerProfile.MunicipalityId;

                var municipality = await _context.Municipalities
                    .FirstOrDefaultAsync(m => m.Id == municipalityId.Value);
                var municipalityName = municipality?.Name;
            }

            var objectsQuery = _context.TouristObjects
                .Include(o => o.ObjectType)
                .Include(o => o.Category)
                .Include(o => o.Municipality) 
                .Include(o => o.Reviews)
                .AsQueryable();

            if (!isAdmin && municipalityId.HasValue)
            {
                objectsQuery = objectsQuery.Where(o => o.MunicipalityId == municipalityId.Value);
            }

            var totalObjects = await objectsQuery.CountAsync();
            var totalActive = await objectsQuery.CountAsync(o => o.Status);
            var totalInactive = totalObjects - totalActive;

            var generalStats = new
            {
                TotalObjects = totalObjects,
                TotalActiveObjects = totalActive,
                TotalInactiveObjects = totalInactive
            };

            var objectsByMunicipality = await objectsQuery
                .GroupBy(o => o.Municipality.Name)
                .Select(g => new { Municipality = g.Key, Count = g.Count() })
                .ToListAsync();

            var objectsByType = await objectsQuery
                .GroupBy(o => o.ObjectType.Name)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            var objectsByCategory = await objectsQuery
                .GroupBy(o => o.Category != null ? o.Category.Name : "N/A")
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToListAsync();

            var ratingRanges = new[]
            {
                new { Min = 1.0, Max = 2.0, Label = "1-2" },
                new { Min = 2.0, Max = 3.0, Label = "2-3" },
                new { Min = 3.0, Max = 4.0, Label = "3-4" },
                new { Min = 4.0, Max = 5.0, Label = "4-5" },
            };

            var objectsByRatingRange = ratingRanges
                .Select(r => new
                {
                    Range = r.Label,
                    Count = objectsQuery.Count(o => o.AverageRating >= r.Min && o.AverageRating < r.Max)
                })
                .ToList();

            var bedsByMunicipality = await objectsQuery
                .GroupBy(o => o.Municipality.Name)
                .Select(g => new { Municipality = g.Key, TotalBeds = g.Sum(o => o.NumberOfBeds) })
                .ToListAsync();

            var topReviewedOverall = await objectsQuery
                .OrderByDescending(o => o.ReviewCount)
                .Take(5)
                .Select(o => new
                {
                    o.Name,
                    o.ReviewCount,
                    o.AverageRating,
                    Municipality = o.Municipality.Name
                })
                .ToListAsync();

            var topReviewedPerMunicipality = await objectsQuery
                .GroupBy(o => o.Municipality.Name)
                .Select(g => new
                {
                    Municipality = g.Key,
                    TopObjects = g.OrderByDescending(o => o.ReviewCount)
                                  .Take(5)
                                  .Select(o => new
                                  {
                                      o.Name,
                                      o.ReviewCount,
                                      o.AverageRating
                                  })
                                  .ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                GeneralStats = generalStats,
                ObjectsByMunicipality = objectsByMunicipality,
                ObjectsByType = objectsByType,
                ObjectsByCategory = objectsByCategory,
                ObjectsByRatingRange = objectsByRatingRange,
                BedsByMunicipality = bedsByMunicipality,
                TopReviewedOverall = topReviewedOverall,
                TopReviewedPerMunicipality = topReviewedPerMunicipality
            });
        }


    }
}