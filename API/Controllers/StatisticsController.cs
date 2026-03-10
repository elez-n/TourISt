using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _service;

        public StatisticsController(IStatisticsService service)
        {
            _service = service;
        }

        [HttpGet("overview")]
        public async Task<ActionResult> GetStatistics()
        {
            var userId = User.GetUserId();
            if (!userId.HasValue) return Unauthorized();

            var result = await _service.GetStatistics(userId.Value);


            if (result == null) return Unauthorized();

            return Ok(result);
        }
    }
}
