using API.DTO;
using API.Entities;

namespace API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<TokenResponseDto> RegisterAsync(UserDto request);
        Task<TokenResponseDto> LoginAsync(UserDto request);
        Task<TokenResponseDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(string refreshToken);
        Task<UserInfoDto?> GetCurrentUserInfoAsync(Guid userId);
    }
}