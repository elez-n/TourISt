using API.DTO;
using API.DTOs;
using API.RequestHelpers;

namespace API.Services
{
public interface IObjectsService
{
    Task<PagedList<ObjectDto>> GetObjectsForVisitor(ObjectParams objectParams);
    Task<PagedList<ObjectDto>> GetObjectsForOfficer(ObjectParams objectParams, Guid officerId, int municipalityId);
    Task<ObjectDto?> GetObject(int id);
    Task<(List<string> types, List<string> municipalities, List<string> categories, List<string> services)> GetFilters();
    Task<List<object>> GetObjectTypes();
    Task<List<object>> GetCategories();
    Task<List<object>> GetMunicipalities();
    Task<List<object>> GetAdditionalServices();
    Task<ObjectDto> CreateObject(TouristObjectCreateDto dto);
    Task<bool> DeleteObject(int id);
    Task<bool> UpdateObject(int id, UpdateTouristObjectDto dto);
    Task<List<ObjectDto>> GetFeaturedObjects();
    Task<List<MapObjectDto>> GetObjectsForMapVisitor(ObjectParams objectParams);
    Task<List<MapObjectDto>> GetObjectsForMapOfficer(ObjectParams objectParams, Guid officerId, int municipalityId);
    Task<OfficerProfileDto?> GetObjectOfficer(Guid officerId);
}

}