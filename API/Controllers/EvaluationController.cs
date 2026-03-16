using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Services;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationService _service;

        public EvaluationController(IEvaluationService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Officer,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateEvaluation(EvaluationCreateDto dto)
        {
            try
            {
                var result = await _service.CreateEvaluationAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{touristObjectId}")]
        public async Task<IActionResult> GetEvaluations(int touristObjectId)
        {
            var evals = await _service.GetEvaluationsAsync(touristObjectId);
            if (!evals.Any())
                return NotFound("Nema kategorizacije za ovaj objekat.");

            return Ok(evals);
        }

        [Authorize(Roles = "Officer,Admin")]
        [HttpGet("criteria")]
        public async Task<IActionResult> GetCriteria()
        {
            var criteria = await _service.GetCriteriaAsync();
            return Ok(criteria);
        }
    }
}