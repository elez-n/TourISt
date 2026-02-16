namespace API.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Visitor";
        public bool IsActive { get; set; } = true;
        public DateTime? LastLogin { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

        public UserProfile Profile { get; set; } = null!;
        public OfficerProfile? OfficerProfile { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
