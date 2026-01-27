using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data; // DbContext
using API.Entities;
using Dipl.Api.Data;
using API.DTOs;
using System.Collections.Immutable; // Entitet Object
using API.Extensions;
using API.RequestHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Azure;

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

    // GET: api/objects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObjectDto>>> GetObjects([FromQuery] ObjectParams objectParams)
    {
      var query = _context.TouristObjects
          .AsQueryable();

      query = query
          .Filter(objectParams.ObjectTypes, objectParams.Municipalities, objectParams.Categories)
          .Search(objectParams.SearchTerm)           // npr. "spa"
          .Sort(objectParams.OrderBy)
          .AsSplitQuery()
          .Include(o => o.ObjectType)
          .Include(o => o.Category)
          .Include(o => o.Municipality)
          .Include(o => o.AdditionalServices)
          .Include(o => o.Photographs);   // beds | bedsdesc | default

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
        CategoryName = o.Category.Name,
        MunicipalityName = o.Municipality.Name,
        AdditionalServices = o.AdditionalServices
                  .Select(s => s.Name)
                  .ToList(),
        Photographs = o.Photographs
                  .Select(p => p.Url)
                  .ToList()
      });

      var pagedList = await PagedList<ObjectDto>.ToPagedList(
dtoQuery,
objectParams.PageNumber, // npr. iz query string-a
objectParams.PageSize
);

      Response.AddPaginationHeader(pagedList.Metadata);
      return pagedList;
    }


    // GET: api/Objects/5
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
        CategoryName = o.Category.Name,
        MunicipalityName = o.Municipality.Name,
        AdditionalServices = o.AdditionalServices.Select(s => s.Name).ToList(),
        Photographs = o.Photographs.Select(p => p.Url).ToList()
      };

      return Ok(dto);
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
      var types = await _context.ObjectTypes.Select(x => x.Name).Distinct().ToListAsync();
      var municipalities = await _context.Municipalities.Select(x => x.Name).Distinct().ToListAsync();
      var categories = await _context.Categories.Select(x => x.Name).Distinct().ToListAsync();


      return Ok(new
      {
        types,
        municipalities,
        categories
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

    [HttpPost("test")]
    public IActionResult TestPost()
    {
      return Ok(new { message = "POST works!" });
    }

    [HttpGet("noviTest")]
    public IActionResult GetAll()
    {
      return Ok(new { message = "GET all works!" });
    }

    [HttpPost]

    public async Task<IActionResult> CreateObject([FromForm] TouristObjectCreateDto dto)
    {
      // Kreiramo entitet
      var touristObject = new TouristObject
      {
        Name = dto.Name,
        ObjectTypeId = dto.ObjectTypeId,
        Status = dto.Status,
        Address = dto.Address,
        Coordinate1 = dto.Coordinate1/100,
        Coordinate2 = dto.Coordinate2/100,
        ContactPhone = dto.ContactPhone,
        ContactEmail = dto.ContactEmail,
        NumberOfUnits = dto.NumberOfUnits,
        NumberOfBeds = dto.NumberOfBeds,
        Description = dto.Description,
        Owner = dto.Owner,
        Featured = dto.Featured,
        CategoryId = dto.CategoryId,
        MunicipalityId = dto.MunicipalityId
      };

      // Dodavanje dodatnih usluga
      if (dto.AdditionalServiceIds != null && dto.AdditionalServiceIds.Any())
      {
        var services = await _context.AdditionalServices
            .Where(s => dto.AdditionalServiceIds.Contains(s.Id))
            .ToListAsync();

        foreach (var s in services)
          touristObject.AdditionalServices.Add(s);
      }

      // Upload fotografija
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

      // Vraćamo kreirani objekat kao DTO
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
        CategoryName = (await _context.Categories.FindAsync(touristObject.CategoryId))?.Name ?? "",
        MunicipalityName = (await _context.Municipalities.FindAsync(touristObject.MunicipalityId))?.Name ?? "",
        AdditionalServices = touristObject.AdditionalServices.Select(s => s.Name).ToList(),
        Photographs = touristObject.Photographs.Select(p => p.Url).ToList()
      };

      return Ok(resultDto);
    }

  }
}
