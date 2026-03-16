using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Services;
using API.DTOs;

[ApiController]
[Route("api/[controller]")]
public class RegistrationRequestsController : ControllerBase
{
    private readonly IRegistrationRequestService _service;

    public RegistrationRequestsController(IRegistrationRequestService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Visitor")]
    [HttpPost]
    public async Task<ActionResult> CreateRequest(RegistrationRequestDto dto)
    {
        await _service.CreateRequestAsync(dto);
        return Ok();
    }

    [HttpGet]
    [Authorize(Roles = "Officer,Admin")]
    public async Task<ActionResult<IEnumerable<GetRegistrationRequestDto>>> GetRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var requests = await _service.GetRequestsForOfficerAsync(userId);
            return Ok(requests);
        }
        catch (InvalidOperationException)
        {
            return Forbid();
        }
    }

    [Authorize(Roles = "Officer,Admin")]
    [HttpPut("{id}/status")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var updated = await _service.UpdateStatusAsync(id, dto.Status);
        if (!updated) return NotFound();

        return NoContent();
    }
}
