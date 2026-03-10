using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using System.Security.Claims;
using Dipl.Api.Data;
using API.DTO;

namespace API.Services
{
    public class ObjectsService : IObjectsService
    {
        private readonly TouristDbContext _context;
        private readonly ILogger<ObjectsService> _logger;

        public ObjectsService(TouristDbContext context, ILogger<ObjectsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PagedList<ObjectDto>> GetObjectsForVisitor(ObjectParams objectParams)
        {
            return await GetObjectsCommon(objectParams, null, null);
        }

        public async Task<PagedList<ObjectDto>> GetObjectsForOfficer(ObjectParams objectParams, Guid officerId, int municipalityId)
        {
            return await GetObjectsCommon(objectParams, officerId, municipalityId);
        }

        private async Task<PagedList<ObjectDto>> GetObjectsCommon(ObjectParams objectParams, Guid? officerId, int? officerMunicipalityId)
        {
            var query = _context.TouristObjects
                .AsQueryable()
                .Include(o => o.ObjectType)
                .Include(o => o.Category)
                .Include(o => o.Municipality)
                .Include(o => o.AdditionalServices)
                .Include(o => o.Photographs)
                .Where(o => o.Status);

            if (officerId.HasValue && officerMunicipalityId.HasValue)
            {
                query = query.Where(o => o.MunicipalityId == officerMunicipalityId.Value);
            }

            query = query
                .Filter(objectParams.ObjectTypes, objectParams.Municipalities, objectParams.Categories, objectParams.AdditionalServices)
                .Search(objectParams.SearchTerm)
                .Sort(objectParams.OrderBy);

            var dtoQuery = query.Select(o => new ObjectDto
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
                CategoryName = o.Category != null ? o.Category.Name : null,
                MunicipalityName = o.Municipality.Name,
                AdditionalServices = o.AdditionalServices.Select(s => s.Name).ToList(),
                Photographs = o.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList(),
                ReviewCount = o.ReviewCount,
                AverageRating = o.AverageRating
            });

            return await PagedList<ObjectDto>.ToPagedList(dtoQuery, objectParams.PageNumber, objectParams.PageSize);
        }

        public async Task<ObjectDto?> GetObject(int id)
        {
            var o = await _context.TouristObjects
                .Include(x => x.ObjectType)
                .Include(x => x.Category)
                .Include(x => x.Municipality)
                .Include(x => x.AdditionalServices)
                .Include(x => x.Photographs)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (o == null) return null;

            return new ObjectDto
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
                CategoryName = o.Category != null ? o.Category.Name : null,
                MunicipalityName = o.Municipality.Name,
                ReviewCount = o.ReviewCount,
                AverageRating = o.AverageRating,
                AdditionalServices = o.AdditionalServices.Select(s => s.Name).ToList(),
                Photographs = o.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList()
            };
        }

        public async Task<(List<string> types, List<string> municipalities, List<string> categories, List<string> services)> GetFilters()
        {
            var types = await _context.ObjectTypes.Select(x => x.Name).Distinct().ToListAsync();
            var municipalities = await _context.Municipalities.Select(x => x.Name).Distinct().ToListAsync();
            var categories = await _context.Categories.Select(x => x.Name).Distinct().ToListAsync();
            var services = await _context.AdditionalServices.Select(x => x.Name).Distinct().ToListAsync();

            return (types, municipalities, categories, services);
        }

        public async Task<List<object>> GetObjectTypes()
        {
            return await _context.ObjectTypes.Select(x => new { x.Id, x.Name }).Distinct().Cast<object>().ToListAsync();
        }

        public async Task<List<object>> GetCategories()
        {
            return await _context.Categories.Select(x => new { x.Id, x.Name }).Distinct().Cast<object>().ToListAsync();
        }

        public async Task<List<object>> GetMunicipalities()
        {
            return await _context.Municipalities.Select(x => new { x.Id, x.Name }).Distinct().Cast<object>().ToListAsync();
        }

        public async Task<List<object>> GetAdditionalServices()
        {
            return await _context.AdditionalServices.Select(x => new { x.Id, x.Name }).Distinct().Cast<object>().ToListAsync();
        }

        public async Task<ObjectDto> CreateObject(TouristObjectCreateDto dto)
        {
            var touristObject = new TouristObject
            {
                Name = dto.Name,
                ObjectTypeId = dto.ObjectTypeId,
                Status = dto.Status,
                Address = dto.Address,
                Coordinate1 = dto.Coordinate1 / 100,
                Coordinate2 = dto.Coordinate2 / 100,
                ContactPhone = dto.ContactPhone,
                ContactEmail = dto.ContactEmail,
                NumberOfUnits = dto.NumberOfUnits,
                NumberOfBeds = dto.NumberOfBeds,
                Description = dto.Description,
                Owner = dto.Owner,
                Featured = dto.Featured,
                CategoryId = null,
                MunicipalityId = dto.MunicipalityId
            };

            if (dto.AdditionalServiceIds != null && dto.AdditionalServiceIds.Any())
            {
                var services = await _context.AdditionalServices.Where(s => dto.AdditionalServiceIds.Contains(s.Id)).ToListAsync();
                foreach (var s in services) touristObject.AdditionalServices.Add(s);
            }

            if (dto.Photographs != null && dto.Photographs.Any())
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Photographs)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    touristObject.Photographs.Add(new Photograph { Url = "/uploads/" + fileName });
                }
            }

            _context.TouristObjects.Add(touristObject);
            await _context.SaveChangesAsync();

            return new ObjectDto
            {
                Id = touristObject.Id,
                Name = touristObject.Name,
                ObjectTypeName = (await _context.ObjectTypes.FindAsync(touristObject.ObjectTypeId))?.Name ?? "",
                Status = touristObject.Status,
                Address = touristObject.Address,
                Coordinate1 = touristObject.Coordinate1,
                Coordinate2 = touristObject.Coordinate2,
                ContactPhone = touristObject.ContactPhone,
                ContactEmail = touristObject.ContactEmail,
                NumberOfUnits = touristObject.NumberOfUnits,
                NumberOfBeds = touristObject.NumberOfBeds,
                Description = touristObject.Description,
                Owner = touristObject.Owner,
                Featured = touristObject.Featured,
                CategoryName = null,
                MunicipalityName = (await _context.Municipalities.FindAsync(touristObject.MunicipalityId))?.Name ?? "",
                AdditionalServices = touristObject.AdditionalServices.Select(s => s.Name).ToList(),
                Photographs = touristObject.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList()
            };
        }

        public async Task<bool> DeleteObject(int id)
        {
            var touristObject = await _context.TouristObjects
                .Include(o => o.Photographs)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (touristObject == null) return false;

            if (touristObject.Photographs.Any())
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                foreach (var photo in touristObject.Photographs)
                {
                    var filePath = Path.Combine(uploadsFolder, Path.GetFileName(photo.Url));
                    if (File.Exists(filePath)) File.Delete(filePath);
                }
            }

            _context.TouristObjects.Remove(touristObject);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateObject(int id, UpdateTouristObjectDto dto)
        {
            var touristObject = await _context.TouristObjects
                .Include(o => o.AdditionalServices)
                .Include(o => o.Photographs)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (touristObject == null) return false;

            touristObject.Name = dto.Name;
            touristObject.ObjectTypeId = dto.ObjectTypeId;
            touristObject.Status = dto.Status;
            touristObject.Address = dto.Address;
            touristObject.Coordinate1 = dto.Coordinate1 / 100;
            touristObject.Coordinate2 = dto.Coordinate2 / 100;
            touristObject.ContactPhone = dto.ContactPhone;
            touristObject.ContactEmail = dto.ContactEmail;
            touristObject.NumberOfUnits = dto.NumberOfUnits;
            touristObject.NumberOfBeds = dto.NumberOfBeds;
            touristObject.Description = dto.Description;
            touristObject.Owner = dto.Owner;
            touristObject.Featured = dto.Featured;
            touristObject.MunicipalityId = dto.MunicipalityId;

            touristObject.AdditionalServices.Clear();

            if (dto.AdditionalServiceIds != null && dto.AdditionalServiceIds.Any())
            {
                var services = await _context.AdditionalServices
                    .Where(s => dto.AdditionalServiceIds.Contains(s.Id))
                    .ToListAsync();

                foreach (var s in services) touristObject.AdditionalServices.Add(s);
            }

            if (dto.DeletedPhotographIds != null && dto.DeletedPhotographIds.Any())
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                var photosToDelete = touristObject.Photographs
                    .Where(p => dto.DeletedPhotographIds.Contains(p.Id))
                    .ToList();

                foreach (var photo in photosToDelete)
                {
                    var filePath = Path.Combine(uploadsFolder, Path.GetFileName(photo.Url));
                    if (File.Exists(filePath)) File.Delete(filePath);

                    _context.Photographs.Remove(photo);
                }
            }

            if (dto.Photographs != null && dto.Photographs.Any())
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Photographs)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    touristObject.Photographs.Add(new Photograph { Url = "/uploads/" + fileName });
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ObjectDto>> GetFeaturedObjects()
        {
            return await _context.TouristObjects
                .AsSplitQuery()
                .Include(o => o.ObjectType)
                .Include(o => o.Category)
                .Include(o => o.Municipality)
                .Include(o => o.AdditionalServices)
                .Include(o => o.Photographs)
                .Where(o => o.Status && o.Featured)
                .Select(o => new ObjectDto
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
                    CategoryName = o.Category != null ? o.Category.Name : null,
                    MunicipalityName = o.Municipality.Name,
                    AdditionalServices = o.AdditionalServices.Select(s => s.Name).ToList(),
                    Photographs = o.Photographs.Select(p => new PhotographDto { Id = p.Id, Url = p.Url }).ToList()
                })
                .ToListAsync();
        }

        private IQueryable<MapObjectDto> BuildMapQuery(ObjectParams objectParams, int? municipalityId = null)
        {
            var query = _context.TouristObjects
                .AsQueryable()
                .Include(o => o.Municipality)
                .Include(o => o.Category)
                .Include(o => o.Photographs)
                .Where(o => o.Status);

            if (municipalityId.HasValue)
            {
                query = query.Where(o => o.MunicipalityId == municipalityId.Value);
            }

            query = query
                .Filter(objectParams.ObjectTypes, objectParams.Municipalities, objectParams.Categories, objectParams.AdditionalServices)
                .Search(objectParams.SearchTerm);

            return query
                .Where(o => o.Coordinate1 != 0 && o.Coordinate2 != 0)
                .Select(o => new MapObjectDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Coordinate1 = o.Coordinate1,
                    Coordinate2 = o.Coordinate2,
                    MunicipalityName = o.Municipality.Name,
                    CategoryName = o.Category != null ? o.Category.Name : null,
                    ThumbnailUrl = o.Photographs.Select(p => p.Url).FirstOrDefault()
                });
        }

        public async Task<List<MapObjectDto>> GetObjectsForMapVisitor(ObjectParams objectParams)
        {
            return await BuildMapQuery(objectParams).ToListAsync();
        }

        public async Task<List<MapObjectDto>> GetObjectsForMapOfficer(ObjectParams objectParams, Guid officerId, int municipalityId)
        {
            return await BuildMapQuery(objectParams, municipalityId).ToListAsync();
        }

        public async Task<OfficerProfileDto?> GetObjectOfficer(Guid officerId)
        {
            var officer = await _context.Users
                .Include(u => u.OfficerProfile)
                .FirstOrDefaultAsync(u => u.Id == officerId);

            if (officer?.OfficerProfile == null) return null;

            return new OfficerProfileDto
            {
                Id = officer.Id,
                MunicipalityId = officer.OfficerProfile.MunicipalityId
            };
        }

    }
}
