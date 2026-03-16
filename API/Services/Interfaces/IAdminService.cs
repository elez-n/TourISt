using API.DTOs;
using API.RequestHelpers;

public interface IAdminService
{
    Task CreateOfficer(OfficerDto dto);
    Task SetPassword(string token, string newPassword);
    Task<object> CreateAdminTemp();
    Task<PagedList<UserListDto>> GetUsers(UserParams userParams);
    Task ToggleUserActiveStatus(Guid userId);
    Task<UserInfoDto> GetUserDetails(Guid id);
    Task UpdateUser(Guid id, AdminUpdateUserDto dto);
}