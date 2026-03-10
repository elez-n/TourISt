using API.Services;
using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class RegistrationRequestService : IRegistrationRequestService
{
    private readonly TouristDbContext _context;

    public RegistrationRequestService(TouristDbContext context)
    {
        _context = context;
    }

    public async Task CreateRequestAsync(RegistrationRequestDto dto)
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
    }

    public async Task<IEnumerable<GetRegistrationRequestDto>> GetRequestsForOfficerAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var officer = await _context.Users
            .Include(u => u.OfficerProfile)
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

        if (officer?.OfficerProfile == null)
            throw new InvalidOperationException("User is not an officer");

        var municipalityId = officer.OfficerProfile.MunicipalityId;

        var requests = await _context.RegistrationRequests
            .Include(r => r.ObjectType)
            .Include(r => r.Municipality)
            .Where(r => r.MunicipalityId == municipalityId && r.Status == "Na čekanju")
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return requests.Select(r => new GetRegistrationRequestDto
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
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var request = await _context.RegistrationRequests.FindAsync(id);
        if (request == null) return false;

        request.Status = status;
        await _context.SaveChangesAsync();

        return true;
    }
}