using API.DTOs;

namespace API.Services
{
    public interface IFavoritesService
    {
        Task AddFavoriteAsync(Guid userId, FavoriteDto dto);
        Task RemoveFavoriteAsync(Guid userId, int objectId);
        Task<List<int>> GetFavoriteIdsAsync(Guid userId);
        Task<List<ObjectDto>> GetFavoritesAsync(Guid userId);
    }
}