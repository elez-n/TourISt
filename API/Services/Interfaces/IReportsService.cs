using API.DTOs;

public interface IReportsService
{
    Task<IEnumerable<object>> GetObjectsReport(ReportDto request);
    Task<byte[]> GeneratePdfReport(ReportDto request);
    Task<byte[]> GenerateCsvReport(ReportDto request);
    Task<byte[]> GenerateXlsxReport(ReportDto request);
}
