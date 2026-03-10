using API.DTO;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using Dipl.Api.Data;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

public class AdminService : IAdminService
{
    private readonly TouristDbContext _context;

    public AdminService(TouristDbContext context)
    {
        _context = context;
    }

    public async Task CreateOfficer(OfficerDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            throw new Exception("Username already exists");

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
    }

    private async Task SendSetPasswordEmail(string email, string username, string link)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("TourISt Admin", Environment.GetEnvironmentVariable("EMAIL")!));
        message.To.Add(new MailboxAddress(username, email));
        message.Subject = "Set your Officer account password";

        message.Body = new TextPart("plain")
        {
            Text = $"Hello {username},\n\n" +
                   $"An officer account has been created for you.\n" +
                   $"Please set your password using the link below:\n\n{link}"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(
            Environment.GetEnvironmentVariable("EMAIL"),
            Environment.GetEnvironmentVariable("PASS"));

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SetPassword(string token, string newPassword)
    {
        var passwordToken = await _context.PasswordTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed);

        if (passwordToken == null || passwordToken.Expiry < DateTime.UtcNow)
            throw new Exception("Invalid or expired token");

        var user = passwordToken.User;

        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, newPassword);

        passwordToken.IsUsed = true;

        await _context.SaveChangesAsync();
    }

    public async Task<object> CreateAdminTemp()
    {
        var username = "admin";
        var password = "Admin123!";

        if (await _context.Users.AnyAsync(u => u.Username == username))
            throw new Exception("Admin already exists");

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
                Email = "admin@test.com"
            }
        };

        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
        admin.PasswordHash = hasher.HashPassword(admin, password);

        _context.Users.Add(admin);
        await _context.SaveChangesAsync();

        return new { username, password };
    }

    public async Task<PagedList<UserListDto>> GetUsers(UserParams userParams)
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

        return await PagedList<UserListDto>.ToPagedList(
            dtoQuery,
            userParams.PageNumber,
            userParams.PageSize);
    }

    public async Task ToggleUserActiveStatus(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception("User not found");

        user.IsActive = !user.IsActive;

        await _context.SaveChangesAsync();
    }

    public async Task<UserInfoDto> GetUserDetails(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.OfficerProfile)
            .ThenInclude(o => o!.Municipality)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            throw new Exception("User not found");

        return new UserInfoDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role,
            FirstName = user.Profile.FirstName,
            LastName = user.Profile.LastName,
            Email = user.Profile.Email,
            Position = user.OfficerProfile?.Position,
            MunicipalityName = user.OfficerProfile?.Municipality?.Name,
            MunicipalityId = user.OfficerProfile?.MunicipalityId
        };
    }

    public async Task UpdateUser(Guid id, AdminUpdateUserDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.OfficerProfile)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            throw new Exception("User not found");

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
    }
}