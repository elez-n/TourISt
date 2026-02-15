using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using Dipl.Api.Data;
using API.DTOs;
using System.Collections.Immutable;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Azure;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ObjectsController : ControllerBase
  {
    private readonly TouristDbContext _context;

    public ObjectsController(TouristDbContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObjectDto>>> GetObjects([FromQuery] ObjectParams objectParams)
    {
      var query = _context.TouristObjects
          .AsQueryable();

      query = query
          .Filter(objectParams.ObjectTypes, objectParams.Municipalities, objectParams.Categories, objectParams.AdditionalServices)
          .Search(objectParams.SearchTerm)
          .Sort(objectParams.OrderBy)
          .AsSplitQuery()
          .Include(o => o.ObjectType)
          .Include(o => o.Category)
          .Include(o => o.Municipality)
          .Include(o => o.AdditionalServices)
          .Include(o => o.Photographs)
          .Where(o => o.Status);

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
        CategoryName = o.Category == null ? null : o.Category.Name,
        MunicipalityName = o.Municipality.Name,
        AdditionalServices = o.AdditionalServices
                  .Select(s => s.Name)
                  .ToList(),
        Photographs = o.Photographs
                  .Select(p => new PhotographDto { Id = p.Id, Url = p.Url })
                  .ToList(),
        ReviewCount = o.ReviewCount,
        AverageRating = o.AverageRating
      });

      var pagedList = await PagedList<ObjectDto>.ToPagedList(
dtoQuery,
objectParams.PageNumber,
objectParams.PageSize
);

      Response.AddPaginationHeader(pagedList.Metadata);
      return pagedList;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ObjectDto>> GetObject(int id)
    {
      var o = await _context.TouristObjects
          .Include(x => x.ObjectType)
          .Include(x => x.Category)
          .Include(x => x.Municipality)
          .Include(x => x.AdditionalServices)
          .Include(x => x.Photographs)
          .FirstOrDefaultAsync(x => x.Id == id);

      if (o == null)
        return NotFound();

      var dto = new ObjectDto
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
        Photographs = o.Photographs
    .Select(p => new PhotographDto
    {
      Id = p.Id,
      Url = p.Url
    })
    .ToList()
      };

      return Ok(dto);
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
      var types = await _context.ObjectTypes.Select(x => x.Name).Distinct().ToListAsync();
      var municipalities = await _context.Municipalities.Select(x => x.Name).Distinct().ToListAsync();
      var categories = await _context.Categories.Select(x => x.Name).Distinct().ToListAsync();
      var additionalServices = await _context.AdditionalServices.Select(x => x.Name).Distinct().ToListAsync();



      return Ok(new
      {
        types,
        municipalities,
        categories,
        additionalServices
      });
    }

    [HttpGet("object-types")]
    public async Task<IActionResult> GetObjectTypes()
    {
      var types = await _context.ObjectTypes.Select(x => new { x.Id, x.Name }).Distinct().ToListAsync();

      return Ok(types);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
      var categories = await _context.Categories.Select(x => new { x.Id, x.Name }).Distinct().ToListAsync();

      return Ok(categories);
    }

    [HttpGet("municipalities")]
    public async Task<IActionResult> GetMunicipalities()
    {
      var municipalities = await _context.Municipalities.Select(x => new { x.Id, x.Name }).Distinct().ToListAsync();

      return Ok(municipalities);
    }

    [HttpGet("additional-services")]
    public async Task<IActionResult> GetAdditionalServices()
    {
      var services = await _context.AdditionalServices.Select(x => new { x.Id, x.Name }).Distinct().ToListAsync();

      return Ok(services);
    }

    [HttpPost]

    public async Task<IActionResult> CreateObject([FromForm] TouristObjectCreateDto dto)
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
        var services = await _context.AdditionalServices
            .Where(s => dto.AdditionalServiceIds.Contains(s.Id))
            .ToListAsync();

        foreach (var s in services)
          touristObject.AdditionalServices.Add(s);
      }

      if (dto.Photographs != null && dto.Photographs.Any())
      {
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
          Directory.CreateDirectory(uploadsFolder);

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

      var resultDto = new ObjectDto
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
        Photographs = touristObject.Photographs
    .Select(p => new PhotographDto
    {
      Id = p.Id,
      Url = p.Url
    })
    .ToList()
      };

      return Ok(resultDto);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteObject(int id)
    {
      var touristObject = await _context.TouristObjects
          .Include(o => o.Photographs)
          .FirstOrDefaultAsync(o => o.Id == id);

      if (touristObject == null)
        return NotFound(new { message = "Objekat nije pronađen." });

      if (touristObject.Photographs.Any())
      {
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "uploads"
        );

        foreach (var photo in touristObject.Photographs)
        {
          var filePath = Path.Combine(
              uploadsFolder,
              Path.GetFileName(photo.Url)
          );

          if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);
        }
      }

      _context.TouristObjects.Remove(touristObject);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    [HttpPut("edit/{id}")]
    public async Task<IActionResult> UpdateObject(int id, [FromForm] UpdateTouristObjectDto dto)
    {
      var touristObject = await _context.TouristObjects
          .Include(o => o.AdditionalServices)
          .Include(o => o.Photographs)
          .FirstOrDefaultAsync(o => o.Id == id);

      if (touristObject == null)
        return NotFound(new { message = "Objekat nije pronađen." });

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
      //touristObject.CategoryId = dto.CategoryId;
      touristObject.MunicipalityId = dto.MunicipalityId;

      touristObject.AdditionalServices.Clear();

      if (dto.AdditionalServiceIds != null && dto.AdditionalServiceIds.Any())
      {
        var services = await _context.AdditionalServices
            .Where(s => dto.AdditionalServiceIds.Contains(s.Id))
            .ToListAsync();

        foreach (var s in services)
          touristObject.AdditionalServices.Add(s);
      }

      if (dto.DeletedPhotographIds != null && dto.DeletedPhotographIds.Any())
      {
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "uploads"
        );

        var photosToDelete = touristObject.Photographs
            .Where(p => dto.DeletedPhotographIds.Contains(p.Id))
            .ToList();

        foreach (var photo in photosToDelete)
        {
          var filePath = Path.Combine(
              uploadsFolder,
              Path.GetFileName(photo.Url)
          );

          if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

          _context.Photographs.Remove(photo);
        }
      }

      if (dto.Photographs != null && dto.Photographs.Any())
      {
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "uploads"
        );

        if (!Directory.Exists(uploadsFolder))
          Directory.CreateDirectory(uploadsFolder);

        foreach (var file in dto.Photographs)
        {
          var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
          var filePath = Path.Combine(uploadsFolder, fileName);

          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            await file.CopyToAsync(stream);
          }

          touristObject.Photographs.Add(new Photograph
          {
            Url = "/uploads/" + fileName
          });
        }
      }

      await _context.SaveChangesAsync();

      return NoContent();
    }

    [HttpGet("featured-objects")]
    public async Task<ActionResult<IEnumerable<ObjectDto>>> GetFeaturedObjects()
    {
      var featuredObjects = await _context.TouristObjects
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
            Photographs = o.Photographs
                  .Select(p => new PhotographDto { Id = p.Id, Url = p.Url })
                  .ToList()
          })
          .ToListAsync();

      return Ok(featuredObjects);
    }


  }
}
