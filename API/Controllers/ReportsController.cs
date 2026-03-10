using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _service;

    public ReportsController(IReportsService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin,Officer")]
    [HttpPost("objects")]
    public async Task<IActionResult> GetObjectsReport([FromBody] ReportDto request)
    {
        var data = await _service.GetObjectsReport(request);
        return Ok(data);
    }

    [Authorize(Roles = "Admin,Officer")]
    [HttpPost("pdf")]
    public async Task<IActionResult> GeneratePdfReport([FromBody] ReportDto request)
    {
        var pdfBytes = await _service.GeneratePdfReport(request);
        return File(pdfBytes, "application/pdf", "izvjestaj.pdf");
    }

    [Authorize(Roles = "Admin,Officer")]
    [HttpPost("csv")]
    public async Task<IActionResult> GenerateCsvReport([FromBody] ReportDto request)
    {
        var csvBytes = await _service.GenerateCsvReport(request);
        return File(csvBytes, "text/csv", "izvjestaj.csv");
    }

    [Authorize(Roles = "Admin,Officer")]
    [HttpPost("xlsx")]
    public async Task<IActionResult> GenerateXlsxReport([FromBody] ReportDto request)
    {
        var xlsxBytes = await _service.GenerateXlsxReport(request);
        return File(xlsxBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "izvjestaj.xlsx");
    }
}
