using System.Security.Claims;
using Dipl.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;
using API.Extensions;
using API.RequestHelpers;

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
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var exists = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.TouristObjectId == dto.ObjectId);

        if (exists)
            return BadRequest("Već dodano u omiljene.");

        _context.Favorites.Add(new Favorite
        {
            UserId = userId.Value,
            TouristObjectId = dto.ObjectId,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = "Objekat dodan u omiljene." });
    }

    [HttpDelete("{objectId}")]
    public async Task<IActionResult> RemoveFavorite(int objectId)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.TouristObjectId == objectId);

        if (favorite == null)
            return NotFound();

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Objekat uklonjen iz omiljenih." });
    }

    [HttpGet("ids")]
    public async Task<ActionResult<List<int>>> GetFavoriteIds()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var favoriteIds = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.TouristObjectId)
            .ToListAsync();

        return Ok(favoriteIds);
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<ObjectDto>>> GetFavorites([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var query = _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.TouristObject)
            .Where(o => o.Status) 
            .Include(o => o.ObjectType)
            .Include(o => o.Category)
            .Include(o => o.Municipality)
            .Include(o => o.Photographs)
            .AsQueryable();

        var dtoQuery = query.Select(o => new ObjectDto
        {
            Id = o.Id,
            Name = o.Name,
            ObjectTypeName = o.ObjectType.Name,
            Status = o.Status,
            Address = o.Address,
            Coordinate1 = o.Coordinate1,
            Coordinate2 = o.Coordinate2,
            ContactPhone = o.ContactPhone,
            ContactEmail = o.ContactEmail,
            NumberOfUnits = o.NumberOfUnits,
            NumberOfBeds = o.NumberOfBeds,
            Description = o.Description,
            Owner = o.Owner,
            Featured = o.Featured,
            CategoryName = o.Category != null ? o.Category.Name : null,
            MunicipalityName = o.Municipality.Name,
            Photographs = o.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList()
        });

        var pagedList = await PagedList<ObjectDto>.ToPagedList(dtoQuery, pageNumber, pageSize);

        Response.AddPaginationHeader(pagedList.Metadata);
        return Ok(pagedList);
    }
}
