using API.DTO;
using API.Entities;
using Dipl.Api.Data;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly TouristDbContext _context;

        public AdminController(TouristDbContext context)
        {
            _context = context;
        }

        [HttpPost("create-officer")]
        public async Task<IActionResult> CreateOfficer(OfficerDto dto)
        {
            // Provjera da li username već postoji
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest("Username already exists");

            // Kreiraj korisnika
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                Role = "Officer",
                IsActive = true,
                Profile = new UserProfile
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email
                },
                OfficerProfile = new OfficerProfile
                {
                    Id = Guid.NewGuid(),
                    Position = dto.Position,
                    MunicipalityId = dto.MunicipalityId
                }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generiši token za setovanje lozinke
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var expiry = DateTime.UtcNow.AddHours(24);

            var passwordToken = new PasswordToken
            {
                UserId = user.Id,
                Token = token,
                Expiry = expiry,
                IsUsed = false
            };

            _context.PasswordTokens.Add(passwordToken);
            await _context.SaveChangesAsync();

            // Link za frontend (lokalni port 3000)
            var link = $"https://localhost:3000/set-password?token={token}";

            // Pošalji stvarni email preko Gmail App Password
            await SendSetPasswordEmail(dto.Email, dto.Username, link);

            return Ok(new { message = "Officer created and email sent to user." });
        }

        private async Task SendSetPasswordEmail(string email, string username, string link)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("TourISt Admin", Environment.GetEnvironmentVariable("EMAIL")!)); // <-- tvoj Gmail
            message.To.Add(new MailboxAddress(username, email));
            message.Subject = "Set your Officer account password";

            message.Body = new TextPart("plain")
            {
                Text = $"Hello {username},\n\n" +
                       $"An officer account has been created for you.\n" +
                       $"Please set your password using the link below (valid for 24 hours):\n\n" +
                       $"{link}\n\n" +
                       $"After setting your password, you can log in normally."
            };

            using var client = new SmtpClient();
            // Gmail SMTP
            await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(Environment.GetEnvironmentVariable("EMAIL"), Environment.GetEnvironmentVariable("PASS")); // <-- tvoj App Password
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword([FromQuery] string token, [FromBody] SetPasswordDto dto)
        {
            var passwordToken = await _context.PasswordTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed);

            if (passwordToken == null || passwordToken.Expiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token.");

            var user = passwordToken.User;

            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);

            passwordToken.IsUsed = true;
            await _context.SaveChangesAsync();

            return Ok("Password set successfully.");
        }

    }

    public class SetPasswordDto
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}
