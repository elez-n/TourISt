namespace API.Entities
{
    public class PasswordToken
    {
        public int Id { get; set; } 
        public Guid UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expiry { get; set; }
        public bool IsUsed { get; set; } = false;

        public User User { get; set; } = null!;
    }
}
