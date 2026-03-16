using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Extensions;
using API.Services;
using API.DTOs;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoritesService _service;

    public FavoritesController(IFavoritesService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin,Officer,Visitor")]
    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto dto)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            await _service.AddFavoriteAsync(userId.Value, dto);
            return Ok(new { message = "Objekat dodan u omiljene." });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Admin,Officer,Visitor")]
    [HttpDelete("{objectId}")]
    public async Task<IActionResult> RemoveFavorite(int objectId)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            await _service.RemoveFavoriteAsync(userId.Value, objectId);
            return Ok(new { message = "Objekat uklonjen iz omiljenih." });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Admin,Officer,Visitor")]
    [HttpGet("ids")]
    public async Task<ActionResult<List<int>>> GetFavoriteIds()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var ids = await _service.GetFavoriteIdsAsync(userId.Value);
        return Ok(ids);
    }

    [Authorize(Roles = "Admin,Officer,Visitor")]
    [HttpGet]
    public async Task<ActionResult<List<ObjectDto>>> GetFavorites()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var favorites = await _service.GetFavoritesAsync(userId.Value);
        return Ok(favorites);
    }
}