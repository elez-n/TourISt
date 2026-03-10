using API.DTOs;
using API.Entities;
using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;

public class ReviewService : IReviewService
{
    private readonly TouristDbContext _context;

    public ReviewService(TouristDbContext context)
    {
        _context = context;
    }

    public async Task<(bool success, string message)> CreateReview(CreateReviewDto dto, Guid userId)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return (false, "Rating must be between 1 and 5.");

        var touristObject = await _context.TouristObjects
            .FirstOrDefaultAsync(o => o.Id == dto.TouristObjectId);

        if (touristObject == null)
            return (false, "Tourist object not found.");

        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.TouristObjectId == dto.TouristObjectId);

        if (existingReview != null)
            return (false, "You have already reviewed this object.");

        var review = new Review
        {
            TouristObjectId = dto.TouristObjectId,
            UserId = userId,
            Rating = dto.Rating,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        touristObject.ReviewCount = await _context.Reviews
            .CountAsync(r => r.TouristObjectId == dto.TouristObjectId);

        touristObject.AverageRating = await _context.Reviews
            .Where(r => r.TouristObjectId == dto.TouristObjectId)
            .AverageAsync(r => (double)r.Rating);

        await _context.SaveChangesAsync();

        return (true, "Review created successfully.");
    }

    public async Task<List<ReviewDto>> GetReviewsForObject(int objectId)
    {
        var touristObjectExists = await _context.TouristObjects
            .AnyAsync(o => o.Id == objectId);

        if (!touristObjectExists)
            return new List<ReviewDto>();

        var reviews = await _context.Reviews
            .Where(r => r.TouristObjectId == objectId)
            .Include(r => r.User)
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

        return reviews;
    }
}
