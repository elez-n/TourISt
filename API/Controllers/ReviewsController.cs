using API.DTOs;
using API.Entities;
using Dipl.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly TouristDbContext _context;

        public ReviewController(TouristDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest("Rating must be between 1 and 5.");

            var touristObject = await _context.TouristObjects
                .FirstOrDefaultAsync(o => o.Id == dto.TouristObjectId);

            if (touristObject == null)
                return NotFound("Tourist object not found.");

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized("User not authenticated.");

            var userId = Guid.Parse(userIdString);

            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.TouristObjectId == dto.TouristObjectId);

            if (existingReview != null)
                return BadRequest("You have already reviewed this object.");

            var review = new Review
            {
                TouristObjectId = dto.TouristObjectId,
                UserId = userId,
                Rating = dto.Rating,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);

            await _context.SaveChangesAsync(); // prvo snimi recenziju

            touristObject.ReviewCount = await _context.Reviews
                .CountAsync(r => r.TouristObjectId == dto.TouristObjectId);

            touristObject.AverageRating = await _context.Reviews
                .Where(r => r.TouristObjectId == dto.TouristObjectId)
                .AverageAsync(r => (double)r.Rating);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review created successfully." });
        }

        [HttpGet("objects/{objectId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsForObject(int objectId)
        {
            var touristObjectExists = await _context.TouristObjects
                .AnyAsync(o => o.Id == objectId);

            if (!touristObjectExists)
                return NotFound("Tourist object not found.");

            var reviews = await _context.Reviews
                .Where(r => r.TouristObjectId == objectId)
                .Include(r => r.User) // da dobijemo Username / FullName
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Description = r.Description,
                    CreatedAt = r.CreatedAt,
                    UserId = r.UserId,
                    Username = r.User.Username,
                    FullName = r.User.Profile.FirstName + " " + r.User.Profile.LastName
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
