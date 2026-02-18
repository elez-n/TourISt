namespace API.RequestHelpers;

public class UserParams : PaginationParams
{
    public string? SearchTerm { get; set; }
    public string? Role { get; set; }
    public string? OrderBy { get; set; }
}
