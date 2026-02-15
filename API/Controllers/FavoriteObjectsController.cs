using System.Security.Claims;
using Dipl.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class FavoritesController : ControllerBase
{
    private readonly TouristDbContext _context;

    public FavoritesController(TouristDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User not authenticated.");

        var userId = Guid.Parse(userIdClaim);

        if (await _context.Favorites.AnyAsync(f => f.UserId == userId && f.TouristObjectId == dto.ObjectId))
            return BadRequest("Već dodano u omiljene.");

        var favorite = new Favorite { UserId = userId, TouristObjectId = dto.ObjectId };
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Objekat dodan u omiljene." });
    }

    [HttpDelete("{objectId}")]
    public async Task<IActionResult> RemoveFavorite(int objectId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User not authenticated.");

        var userId = Guid.Parse(userIdClaim);
        var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.TouristObjectId == objectId);

        if (favorite == null) return NotFound();

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Objekat uklonjen iz omiljenih." });
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User not authenticated.");

        var userId = Guid.Parse(userIdClaim);

        var favorites = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.TouristObject)
                .ThenInclude(o => o.ObjectType)
            .Include(f => f.TouristObject)
                .ThenInclude(o => o.Category)
            .Include(f => f.TouristObject)
                .ThenInclude(o => o.Municipality)
            .Include(f => f.TouristObject)
                .ThenInclude(o => o.AdditionalServices)
            .Include(f => f.TouristObject)
                .ThenInclude(o => o.Photographs)
            .ToListAsync();

        var response = favorites.Select(f => new FavoriteObjectDto
        {
            Id = f.TouristObject.Id,
            Name = f.TouristObject.Name,
            ObjectTypeName = f.TouristObject.ObjectType.Name,
            Status = f.TouristObject.Status,
            Address = f.TouristObject.Address,
            Coordinate1 = f.TouristObject.Coordinate1,
            Coordinate2 = f.TouristObject.Coordinate2,
            ContactPhone = f.TouristObject.ContactPhone,
            ContactEmail = f.TouristObject.ContactEmail,
            NumberOfUnits = f.TouristObject.NumberOfUnits,
            NumberOfBeds = f.TouristObject.NumberOfBeds,
            Description = f.TouristObject.Description,
            Owner = f.TouristObject.Owner,
            Featured = f.TouristObject.Featured,
            CategoryName = f.TouristObject.Category?.Name,
            MunicipalityName = f.TouristObject.Municipality.Name,
            AdditionalServices = f.TouristObject.AdditionalServices.Select(s => s.Name).ToList(),
            Photographs = f.TouristObject.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList(),
            ReviewCount = f.TouristObject.ReviewCount,
            AverageRating = f.TouristObject.AverageRating,
            AddedAt = f.CreatedAt
        }).ToList();

        return Ok(response);
    }
}
