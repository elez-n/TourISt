using System.Security.Claims;

namespace API.Extensions
{
    public static class UserExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return id is null ? null : Guid.Parse(id);
        }
    }
}
