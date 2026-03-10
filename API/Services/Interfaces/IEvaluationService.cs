using API.DTOs;

namespace API.Services
{
    public interface IEvaluationService
    {
        Task<EvaluationResultDto> CreateEvaluationAsync(EvaluationCreateDto dto);
        Task<List<EvaluationDto>> GetEvaluationsAsync(int touristObjectId);
        Task<List<CriteriaDto>> GetCriteriaAsync();
    }
}