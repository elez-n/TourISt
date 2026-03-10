using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _service;

        public ReviewController(IReviewService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized("User not authenticated.");

            var userId = Guid.Parse(userIdString);

            var (success, message) = await _service.CreateReview(dto, userId);

            if (!success)
                return BadRequest(message);

            return Ok(new { message });
        }

        [HttpGet("objects/{objectId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsForObject(int objectId)
        {
            var reviews = await _service.GetReviewsForObject(objectId);

            if (reviews == null || reviews.Count == 0)
                return NotFound("Tourist object not found or no reviews.");

            return Ok(reviews);
        }
    }
}
