public interface IStatisticsService
{
    Task<object?> GetStatistics(Guid userId);
}
