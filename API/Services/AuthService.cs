using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.DTO;
using API.Entities;
using Dipl.Api.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using API.Services.Interfaces;

namespace API.Services
{
    public class AuthService : IAuthService
    {
        private readonly TouristDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(TouristDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<TokenResponseDto> RegisterAsync(UserDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                throw new ArgumentException("Username i password su obavezni.");

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                throw new ArgumentException("Korisničko ime već postoji.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Role = "Visitor"
            };

            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

            user.Profile = new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var savedUser = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.OfficerProfile!)
                    .ThenInclude(op => op.Municipality)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (savedUser == null)
                throw new Exception("Greška prilikom kreiranja korisnika.");

            var accessToken = CreateToken(savedUser);
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(savedUser);

            return new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserId = savedUser.Id.ToString()
            };
        }

        public async Task<TokenResponseDto> LoginAsync(UserDto request)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.OfficerProfile!)
                    .ThenInclude(op => op.Municipality)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user is null)
                throw new UnauthorizedAccessException("Pogrešno korisničko ime ili lozinka.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Nalog je deaktiviran. Kontaktirajte administratora.");

            var passwordCheck = new PasswordHasher<User>()
                .VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (passwordCheck == PasswordVerificationResult.Failed)
                throw new UnauthorizedAccessException("Pogrešno korisničko ime ili lozinka.");

            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var accessToken = CreateToken(user);
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(user);

            return new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserId = user.Id.ToString()
            };
        }

        public async Task<TokenResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .Include(rt => rt.User)
                    .ThenInclude(u => u.Profile)
                .Include(rt => rt.User)
                    .ThenInclude(u => u.OfficerProfile!)
                        .ThenInclude(op => op.Municipality)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.Revoked);

            if (token == null || token.ExpiresAt <= DateTime.UtcNow)
                throw new UnauthorizedAccessException("Invalid refresh token.");

            var newAccessToken = CreateToken(token.User);

            return new TokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = refreshToken,
                UserId = token.UserId.ToString()
            };
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (token != null)
            {
                token.Revoked = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserInfoDto?> GetCurrentUserInfoAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role,
                    FirstName = u.Profile.FirstName,
                    LastName = u.Profile.LastName,
                    Email = u.Profile.Email,
                    Position = u.OfficerProfile != null ? u.OfficerProfile.Position : null,
                    MunicipalityName = u.OfficerProfile != null ? u.OfficerProfile.Municipality.Name : null
                })
                .FirstOrDefaultAsync();
        }

        #region Helpers

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.Id.ToString()),
                new Claim("username", user.Username),
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["AppSettings:Issuer"],
                audience: _configuration["AppSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();

            var token = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                Revoked = false
            };

            _context.RefreshTokens.Add(token);
            await _context.SaveChangesAsync();

            return refreshToken;
        }

        #endregion
    }
}