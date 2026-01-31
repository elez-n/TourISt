using Api.Entities;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dipl.Api.Data
{
    public class TouristDbContext : DbContext
    {
        public TouristDbContext(DbContextOptions<TouristDbContext> options)
            : base(options) { }

        public DbSet<ObjectType> ObjectTypes { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Photograph> Photographs { get; set; } = null!;
        public DbSet<Municipality> Municipalities { get; set; } = null!;
        public DbSet<AdditionalService> AdditionalServices { get; set; } = null!;
        public DbSet<TouristObject> TouristObjects { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<OfficerProfile> OfficerProfiles { get; set; }


    }
}