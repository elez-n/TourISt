using API.DTOs;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("create-officer")]
    public async Task<IActionResult> CreateOfficer(OfficerDto dto)
    {
        await _service.CreateOfficer(dto);
        return Ok("Službenik uspješno kreiran.");
    }

    [HttpPost("set-password")]
    public async Task<IActionResult> SetPassword([FromQuery] string token, [FromBody] SetPasswordDto dto)
    {
        await _service.SetPassword(token, dto.NewPassword);
        return Ok("Lozinka postavljena.");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<ActionResult> GetUsers([FromQuery] UserParams userParams)
    {
        var users = await _service.GetUsers(userParams);
        Response.AddPaginationHeader(users.Metadata);
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("toggle-active/{userId}")]
    public async Task<IActionResult> ToggleUserActiveStatus(Guid userId)
    {
        await _service.ToggleUserActiveStatus(userId);
        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users/{id}")]
    public async Task<ActionResult> GetUserDetails(Guid id)
    {
        var user = await _service.GetUserDetails(id);
        return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, AdminUpdateUserDto dto)
    {
        await _service.UpdateUser(id, dto);
        return Ok();
    }
}