using System;

namespace API.RequestHelpers;

public class ObjectParams : PaginationParams
{
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public string? ObjectTypes { get; set; }
    public string? Municipalities { get; set; }
    public string? Categories { get; set; }

}
