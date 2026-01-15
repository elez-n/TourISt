using Dipl.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    private readonly TouristDbContext _context;

    public TestController(TouristDbContext context)
    {
        _context = context;
    }

    [HttpGet("db")]
    public async Task<IActionResult> TestDb()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            return Ok(new { connected = canConnect });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("dbb")]
public IActionResult TestDbb()
{
    try
    {
        using var conn = new SqlConnection(
            "Server=localhost\\SQLEXPRESS;Trusted_Connection=True;TrustServerCertificate=True;"
        );
        conn.Open();
        return Ok("SQL Server OK");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

}
