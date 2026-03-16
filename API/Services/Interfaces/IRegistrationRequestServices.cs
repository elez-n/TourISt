using API.DTOs;

namespace API.Services
{
    public interface IRegistrationRequestService
    {
        Task CreateRequestAsync(RegistrationRequestDto dto);
        Task<IEnumerable<GetRegistrationRequestDto>> GetRequestsForOfficerAsync(string userId);
        Task<bool> UpdateStatusAsync(int id, string status);
    }
}