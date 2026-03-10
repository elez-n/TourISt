using System.Text;
using API.Entities;
using API.Extensions;
using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ClosedXML.Excel;

public class ReportsService : IReportsService
{
    private readonly TouristDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ReportsService(TouristDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<IEnumerable<object>> GetObjectsReport(ReportDto request)
    {
        var data = await GetFilteredData(request);

        return data.Select(o => new
        {
            o.Name,
            ObjectType = o.ObjectType.Name,
            Category = o.Category?.Name ?? "-",
            Municipality = o.Municipality.Name,
            Status = o.Status ? "Aktivan" : "Neaktivan"
        });
    }

    public async Task<byte[]> GeneratePdfReport(ReportDto request)
    {
        var data = await GetFilteredData(request);
        var filters = await GetFilterText(request);

        var pdfBytes = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);

                page.Header()
                    .Text("IZVJEŠTAJ O TURISTIČKIM OBJEKTIMA")
                    .FontSize(18)
                    .Bold()
                    .AlignCenter();

                page.Content().PaddingVertical(20).Column(column =>
                {
                    column.Item().Text($"Datum generisanja: {DateTime.Now:dd.MM.yyyy HH:mm}");
                    column.Item().PaddingTop(5).Text(filters).Italic().FontSize(12);
                    column.Item().PaddingTop(10);

                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Naziv").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Tip").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Kategorija").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Opština").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Status").Bold();
                        });

                        bool shade = false;
                        foreach (var o in data)
                        {
                            var bgColor = shade ? Colors.Grey.Lighten3 : Colors.White;
                            shade = !shade;

                            table.Cell().Background(bgColor).Padding(5).Text(o.Name);
                            table.Cell().Background(bgColor).Padding(5).Text(o.ObjectType.Name);
                            table.Cell().Background(bgColor).Padding(5).Text(o.Category?.Name ?? "-");
                            table.Cell().Background(bgColor).Padding(5).Text(o.Municipality.Name);
                            table.Cell().Background(bgColor).Padding(5).Text(o.Status ? "Aktivan" : "Neaktivan");
                        }
                    });

                    column.Item().PaddingTop(20).Text($"Ukupan broj objekata: {data.Count}").Bold();
                });
            });
        }).GeneratePdf();

        return pdfBytes;
    }

    public async Task<byte[]> GenerateCsvReport(ReportDto request)
    {
        var data = await GetFilteredData(request);
        var csv = new StringBuilder();

        var objectTypeNames = request.ObjectTypeIds?.Any() == true
            ? await _context.ObjectTypes.Where(t => request.ObjectTypeIds.Contains(t.Id)).Select(t => t.Name).ToListAsync()
            : new List<string>();
        var categoryNames = request.CategoryIds?.Any() == true
            ? await _context.Categories.Where(c => request.CategoryIds.Contains(c.Id)).Select(c => c.Name).ToListAsync()
            : new List<string>();
        var municipalityNames = request.MunicipalityIds?.Any() == true
            ? await _context.Municipalities.Where(m => request.MunicipalityIds.Contains(m.Id)).Select(m => m.Name).ToListAsync()
            : new List<string>();

        csv.AppendLine($"# Izvještaj generisan: {DateTime.Now:dd.MM.yyyy HH:mm}");
        csv.AppendLine($"# Status: {(request.Status.HasValue ? (request.Status.Value ? "Aktivan" : "Neaktivan") : "Svi")}");
        csv.AppendLine($"# Tipovi objekata: {(objectTypeNames.Any() ? string.Join(", ", objectTypeNames) : "Svi")}");
        csv.AppendLine($"# Kategorije: {(categoryNames.Any() ? string.Join(", ", categoryNames) : "Sve")}");
        csv.AppendLine($"# Opštine: {(municipalityNames.Any() ? string.Join(", ", municipalityNames) : "Sve")}");
        csv.AppendLine();
        csv.AppendLine("Naziv;Tip;Kategorija;Opština;Status");

        foreach (var o in data)
            csv.AppendLine($"\"{o.Name}\";\"{o.ObjectType.Name}\";\"{(o.Category != null ? o.Category.Name : "-")}\";\"{o.Municipality.Name}\";\"{(o.Status ? "Aktivan" : "Neaktivan")}\"");

        csv.AppendLine();
        csv.AppendLine($"# Ukupan broj objekata: {data.Count}");

        return new byte[] { 0xEF, 0xBB, 0xBF }.Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
    }

    public async Task<byte[]> GenerateXlsxReport(ReportDto request)
    {
        var data = await GetFilteredData(request);

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Izvještaj");

        int row = 1;
        ws.Cell(row++, 1).Value = $"Izvještaj generisan: {DateTime.Now:dd.MM.yyyy HH:mm}";
        ws.Cell(row++, 1).Value = $"Status: {(request.Status.HasValue ? (request.Status.Value ? "Aktivan" : "Neaktivan") : "Svi")}";

        row++;
        ws.Cell(row, 1).Value = "Naziv";
        ws.Cell(row, 2).Value = "Tip";
        ws.Cell(row, 3).Value = "Kategorija";
        ws.Cell(row, 4).Value = "Opština";
        ws.Cell(row, 5).Value = "Status";

        row++;

        foreach (var o in data)
        {
            ws.Cell(row, 1).Value = o.Name;
            ws.Cell(row, 2).Value = o.ObjectType.Name;
            ws.Cell(row, 3).Value = o.Category?.Name ?? "-";
            ws.Cell(row, 4).Value = o.Municipality.Name;
            ws.Cell(row, 5).Value = o.Status ? "Aktivan" : "Neaktivan";
            row++;
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<List<TouristObject>> GetFilteredData(ReportDto request)
    {
        var userId = _httpContextAccessor.HttpContext!.User.GetUserId();

        var user = await _context.Users
            .Include(u => u.OfficerProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception("User not found");

        var query = _context.TouristObjects
            .Include(o => o.ObjectType)
            .Include(o => o.Category)
            .Include(o => o.Municipality)
            .AsQueryable();

        query = ApplyFilters(query, request, user);
        return await query.ToListAsync();
    }

    private IQueryable<TouristObject> ApplyFilters(IQueryable<TouristObject> query, ReportDto request, User user)
    {
        if (user.Role == "Officer")
        {
            if (user.OfficerProfile == null)
                throw new Exception("Officer profile not found");

            query = query.Where(o => o.MunicipalityId == user.OfficerProfile.MunicipalityId);
        }
        else if (user.Role == "Admin" && request.MunicipalityIds?.Any() == true)
        {
            query = query.Where(o => request.MunicipalityIds.Contains(o.MunicipalityId));
        }

        if (request.Status.HasValue)
            query = query.Where(o => o.Status == request.Status.Value);

        if (request.ObjectTypeIds?.Any() == true)
            query = query.Where(o => request.ObjectTypeIds.Contains(o.ObjectTypeId));

        if (request.CategoryIds?.Any() == true)
            query = query.Where(o => o.CategoryId.HasValue && request.CategoryIds.Contains(o.CategoryId.Value));

        if (!string.IsNullOrWhiteSpace(request.Sort))
        {
            switch (request.Sort.ToLower())
            {
                case "stars":
                    query = query
                        .OrderByDescending(o => o.Category != null) 
                        .ThenBy(o => o.Category!.Stars);
                    break;

                case "starsdesc":
                    query = query
                        .OrderByDescending(o => o.Category != null)
                        .ThenByDescending(o => o.Category!.Stars);
                    break;

                case "namedesc":
                    query = query.OrderByDescending(o => o.Name);
                    break;

                case "name":
                default:
                    query = query.OrderBy(o => o.Name);
                    break;
            }
        }
        else
        {
            query = query.OrderBy(o => o.Name);
        }

        return query;
    }

    private async Task<string> GetFilterText(ReportDto request)
    {
        var filters = new List<string> { "Prikaz objekata" };

        if (request.ObjectTypeIds?.Any() == true)
        {
            var types = await _context.ObjectTypes
                .Where(t => request.ObjectTypeIds.Contains(t.Id))
                .Select(t => t.Name)
                .ToListAsync();
            filters.Add($"tipa {string.Join(", ", types)}");
        }

        if (request.CategoryIds?.Any() == true)
        {
            var categories = await _context.Categories
                .Where(c => request.CategoryIds.Contains(c.Id))
                .Select(c => c.Name)
                .ToListAsync();
            filters.Add($"kategorije {string.Join(", ", categories)}");
        }

        if (request.MunicipalityIds?.Any() == true)
        {
            var municipalities = await _context.Municipalities
                .Where(m => request.MunicipalityIds.Contains(m.Id))
                .Select(m => m.Name)
                .ToListAsync();
            filters.Add($"na području opština {string.Join(", ", municipalities)}");
        }

        if (request.Status.HasValue)
            filters.Add(request.Status.Value ? "aktivni" : "neaktivni");

        return string.Join(", ", filters);
    }
}


