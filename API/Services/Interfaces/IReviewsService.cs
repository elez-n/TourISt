using API.DTOs;

public interface IReviewService
{
    Task<(bool success, string message)> CreateReview(CreateReviewDto dto, Guid userId);
    Task<List<ReviewDto>> GetReviewsForObject(int objectId);
}
