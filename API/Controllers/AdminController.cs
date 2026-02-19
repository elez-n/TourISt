using API.DTO;
using API.Entities;
using Dipl.Api.Data;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using API.RequestHelpers;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

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
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest("Username already exists");

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

            var link = $"https://localhost:3000/set-password?token={token}&username={dto.Username}";

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

        [HttpPost("create-admin-temp")]
        public async Task<IActionResult> CreateAdminTemp()
        {
            var username = "admin";
            var email = "admin@test.com";
            var password = "Admin123!";

            if (await _context.Users.AnyAsync(u => u.Username == username))
                return BadRequest("Admin already exists.");

            var admin = new User
            {
                Id = Guid.NewGuid(),
                Username = username,
                Role = "Admin",
                IsActive = true,
                Profile = new UserProfile
                {
                    Id = Guid.NewGuid(),
                    FirstName = "System",
                    LastName = "Administrator",
                    Email = email
                }
            };

            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            admin.PasswordHash = hasher.HashPassword(admin, password);

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Admin created successfully.",
                username,
                password
            });
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers(
    [FromQuery] UserParams userParams)
        {
            var query = _context.Users
                .Include(u => u.Profile)
                .AsQueryable();

            query = query
                .Filter(userParams.Role)
                .Search(userParams.SearchTerm)
                .Sort(userParams.OrderBy);

            var dtoQuery = query.Select(u => new UserListDto
            {
                Id = u.Id,
                Username = u.Username,
                FirstName = u.Profile.FirstName,
                LastName = u.Profile.LastName,
                Email = u.Profile.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                LastLogin = u.LastLogin
            });

            var pagedList = await PagedList<UserListDto>.ToPagedList(
                dtoQuery,
                userParams.PageNumber,
                userParams.PageSize
            );

            Response.AddPaginationHeader(pagedList.Metadata);

            return pagedList;
        }

        [HttpPatch("toggle-active/{userId}")]
        public async Task<IActionResult> ToggleUserActiveStatus(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("Korisnik nije pronađen.");

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Korisnik '{user.Username}' je sada {(user.IsActive ? "aktivan" : "deaktiviran")}.",
                isActive = user.IsActive
            });
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserInfoDto>> GetUserDetails(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.OfficerProfile)
                .ThenInclude(o => o!.Municipality) 
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound("User not found.");

            var dto = new UserInfoDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                FirstName = user.Profile.FirstName,
                LastName = user.Profile.LastName,
                Email = user.Profile.Email,
                Position = user.OfficerProfile?.Position,
                MunicipalityName = user.OfficerProfile?.Municipality?.Name,
                MunicipalityId = user.OfficerProfile?.MunicipalityId,
            };

            return Ok(dto);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, AdminUpdateUserDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.OfficerProfile)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound("User not found.");

            user.Username = dto.Username;
            user.Profile.FirstName = dto.FirstName;
            user.Profile.LastName = dto.LastName;
            user.Profile.Email = dto.Email;

            if (user.Role == "Officer" && user.OfficerProfile != null)
            {
                if (dto.Position != null)
                    user.OfficerProfile.Position = dto.Position;

                if (dto.MunicipalityId.HasValue)
                    user.OfficerProfile.MunicipalityId = dto.MunicipalityId.Value;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    public class SetPasswordDto
    {
        public string NewPassword { get; set; } = string.Empty;
    }


}
