using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.DTOs;
using API.RequestHelpers;
using API.Services;
using API.Extensions;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObjectsController : ControllerBase
    {
        private readonly IObjectsService _service;

        public ObjectsController(IObjectsService service)
        {
            _service = service;
        }

        [HttpGet("visitor")]
        public async Task<ActionResult<IEnumerable<ObjectDto>>> GetObjectsForVisitor([FromQuery] ObjectParams objectParams)
        {
            var pagedList = await _service.GetObjectsForVisitor(objectParams);
            Response.AddPaginationHeader(pagedList.Metadata);
            return pagedList;
        }

        [Authorize(Roles = "Officer")]
        [HttpGet("officer")]
        public async Task<ActionResult<IEnumerable<ObjectDto>>> GetObjectsForOfficer([FromQuery] ObjectParams objectParams)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var officer = await _service.GetObjectOfficer(Guid.Parse(userId));
            if (officer == null) return Forbid();

            var pagedList = await _service.GetObjectsForOfficer(objectParams, officer.Id, officer.MunicipalityId);
            Response.AddPaginationHeader(pagedList.Metadata);
            return pagedList;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ObjectDto>> GetObject(int id)
        {
            var dto = await _service.GetObject(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var filters = await _service.GetFilters();
            return Ok(new
            {
                types = filters.types,
                municipalities = filters.municipalities,
                categories = filters.categories,
                additionalServices = filters.services
            });
        }

        [HttpGet("object-types")]
        public async Task<IActionResult> GetObjectTypes()
        {
            var types = await _service.GetObjectTypes();
            return Ok(types);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _service.GetCategories();
            return Ok(categories);
        }

        [HttpGet("municipalities")]
        public async Task<IActionResult> GetMunicipalities()
        {
            var municipalities = await _service.GetMunicipalities();
            return Ok(municipalities);
        }

        [HttpGet("additional-services")]
        public async Task<IActionResult> GetAdditionalServices()
        {
            var services = await _service.GetAdditionalServices();
            return Ok(services);
        }

        [HttpPost]
        public async Task<IActionResult> CreateObject([FromForm] TouristObjectCreateDto dto)
        {
            var resultDto = await _service.CreateObject(dto);
            return Ok(resultDto);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteObject(int id)
        {
            var deleted = await _service.DeleteObject(id);
            if (!deleted) return NotFound(new { message = "Objekat nije pronađen." });
            return NoContent();
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> UpdateObject(int id, [FromForm] UpdateTouristObjectDto dto)
        {
            var updated = await _service.UpdateObject(id, dto);
            if (!updated) return NotFound(new { message = "Objekat nije pronađen." });
            return NoContent();
        }

        [HttpGet("featured-objects")]
        public async Task<ActionResult<IEnumerable<ObjectDto>>> GetFeaturedObjects()
        {
            var featuredObjects = await _service.GetFeaturedObjects();
            return Ok(featuredObjects);
        }

        [HttpGet("map/visitor")]
        public async Task<ActionResult<IEnumerable<MapObjectDto>>> GetObjectsForMapVisitor([FromQuery] ObjectParams objectParams)
        {
            var result = await _service.GetObjectsForMapVisitor(objectParams);
            return Ok(result);
        }

        [Authorize(Roles = "Officer")]
        [HttpGet("map/officer")]
        public async Task<ActionResult<IEnumerable<MapObjectDto>>> GetObjectsForMapOfficer([FromQuery] ObjectParams objectParams)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var officer = await _service.GetObjectOfficer(Guid.Parse(userId));
            if (officer == null) return Forbid();

            var result = await _service.GetObjectsForMapOfficer(objectParams, officer.Id, officer.MunicipalityId);
            return Ok(result);
        }
    }
}
