using API.DTOs;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Entities;

namespace API.Services
{
    public class FavoritesService : IFavoritesService
    {
        private readonly TouristDbContext _context;

        public FavoritesService(TouristDbContext context)
        {
            _context = context;
        }

        public async Task AddFavoriteAsync(Guid userId, FavoriteDto dto)
        {
            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.TouristObjectId == dto.ObjectId);

            if (exists)
                throw new Exception("Već dodano u omiljene.");

            _context.Favorites.Add(new Favorite
            {
                UserId = userId,
                TouristObjectId = dto.ObjectId,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemoveFavoriteAsync(Guid userId, int objectId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.TouristObjectId == objectId);

            if (favorite == null)
                throw new Exception("Omiljeni objekat nije pronađen.");

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<List<int>> GetFavoriteIdsAsync(Guid userId)
        {
            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.TouristObjectId)
                .ToListAsync();
        }

        public async Task<List<ObjectDto>> GetFavoritesAsync(Guid userId)
        {
            var objects = await _context.TouristObjects
                .Where(o => o.Status &&
                            _context.Favorites.Any(f => f.UserId == userId && f.TouristObjectId == o.Id))
                .Include(o => o.ObjectType)
                .Include(o => o.Category)
                .Include(o => o.Municipality)
                .Include(o => o.Photographs)
                .ToListAsync();

            var result = objects.Select(o => new ObjectDto
            {
                Id = o.Id,
                Name = o.Name,
                ObjectTypeName = o.ObjectType.Name,
                Status = o.Status,
                Address = o.Address,
                Coordinate1 = o.Coordinate1,
                Coordinate2 = o.Coordinate2,
                ContactPhone = o.ContactPhone,
                ContactEmail = o.ContactEmail,
                NumberOfUnits = o.NumberOfUnits,
                NumberOfBeds = o.NumberOfBeds,
                Description = o.Description,
                Owner = o.Owner,
                Featured = o.Featured,
                CategoryName = o.Category?.Name,
                MunicipalityName = o.Municipality?.Name,
                Photographs = o.Photographs
                    .Select(p => new PhotographDto
                    {
                        Id = p.Id,
                        Url = p.Url
                    }).ToList()
            }).ToList();

            return result;
        }
    }
}