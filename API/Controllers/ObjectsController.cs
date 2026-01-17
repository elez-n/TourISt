using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data; // DbContext
using API.Entities;
using Dipl.Api.Data;
using API.DTOs; // Entitet Object

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
    public async Task<ActionResult<IEnumerable<ObjectDto>>> GetObjects()
    {
      var objects = await _context.TouristObjects
          .Include(o => o.ObjectType)
          .Include(o => o.Category)
          .Include(o => o.Municipality)
          .Include(o => o.AdditionalServices)
          .Include(o => o.Photographs)
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
            CategoryName = o.Category.Name,
            MunicipalityName = o.Municipality.Name,
            AdditionalServices = o.AdditionalServices.Select(s => s.Name).ToList(),
            Photographs = o.Photographs.Select(p => p.Url).ToList()
          })
          .ToListAsync();

      return Ok(objects);
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
  }
}
