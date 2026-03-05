using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using Dipl.Api.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class RegistrationRequestsController : ControllerBase
{
    private readonly TouristDbContext _context;

    public RegistrationRequestsController(TouristDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> CreateRequest(RegistrationRequestDto dto)
    {
        var request = new RegistrationRequest
        {
            OwnerFirstName = dto.OwnerFirstName,
            OwnerLastName = dto.OwnerLastName,
            OwnerPhone = dto.OwnerPhone,
            OwnerEmail = dto.OwnerEmail,
            ObjectName = dto.ObjectName,
            ObjectTypeId = dto.ObjectTypeId,
            MunicipalityId = dto.MunicipalityId,
            Address = dto.Address,
            Status = "Na čekanju",
            CreatedAt = DateTime.UtcNow
        };

        _context.RegistrationRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    [Authorize(Roles = "Officer,Admin")]
    public async Task<ActionResult<IEnumerable<GetRegistrationRequestDto>>> GetRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var officer = await _context.Users
            .Include(u => u.OfficerProfile)
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

        if (officer?.OfficerProfile == null)
            return Forbid();

        var municipalityId = officer.OfficerProfile.MunicipalityId;

        var requests = await _context.RegistrationRequests
     .Include(r => r.ObjectType)
     .Include(r => r.Municipality)
     .Where(r => r.MunicipalityId == municipalityId && r.Status == "Na čekanju")
     .OrderByDescending(r => r.CreatedAt)
     .ToListAsync();

        var dtoList = requests.Select(r => new GetRegistrationRequestDto
        {
            Id = r.Id,
            OwnerFirstName = r.OwnerFirstName,
            OwnerLastName = r.OwnerLastName,
            OwnerPhone = r.OwnerPhone,
            OwnerEmail = r.OwnerEmail,
            ObjectName = r.ObjectName,
            ObjectType = r.ObjectType.Name,
            Municipality = r.Municipality.Name,
            Address = r.Address,
            Status = r.Status,
            CreatedAt = r.CreatedAt
        }).ToList();

        return dtoList;
    }

[HttpPut("{id}/status")]
public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
{
    var request = await _context.RegistrationRequests.FindAsync(id);
    if (request == null) return NotFound();

    request.Status = dto.Status;
    await _context.SaveChangesAsync();

    return NoContent();
}
}