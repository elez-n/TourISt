using System.Security.Claims;
using API.Entities;

namespace API.Extensions
{
    public static class UserExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return id is null ? null : Guid.Parse(id);
        }

        public static IQueryable<User> Search(this IQueryable<User> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCase = searchTerm.ToLower();

            return query.Where(u =>
                u.Username.ToLower().Contains(lowerCase) ||
                u.Profile.FirstName.ToLower().Contains(lowerCase) ||
                u.Profile.LastName.ToLower().Contains(lowerCase)
            );
        }

        public static IQueryable<User> Filter(this IQueryable<User> query, string? role)
        {
            if (string.IsNullOrEmpty(role)) return query;

            return query.Where(u => u.Role == role);
        }

        public static IQueryable<User> Sort(this IQueryable<User> query, string? orderBy)
        {
            return orderBy switch
            {
                "username" => query.OrderBy(u => u.Username),
                "usernamedesc" => query.OrderByDescending(u => u.Username),
                "name" => query.OrderBy(u => u.Profile.FirstName),
                "namedesc" => query.OrderByDescending(u => u.Profile.FirstName),
                "lastname" => query.OrderBy(u => u.Profile.LastName),
                "lastnamedesc" => query.OrderByDescending(u => u.Profile.LastName),
                _ => query.OrderBy(u => u.Username)
            };
        }
    }
}
