public class GeneralStatisticsDto
{
    public int TotalObjects { get; set; }
    public int TotalActiveObjects { get; set; }
    public int TotalInactiveObjects { get; set; }
}

public class ObjectsByMunicipalityDto
{
    public string Municipality { get; set; } = null!;
    public int Count { get; set; }
}

public class ObjectsByTypeDto
{
    public string Type { get; set; } = null!;
    public int Count { get; set; }
}

public class ObjectsByCategoryDto
{
    public string Category { get; set; } = null!;
    public int Count { get; set; }
}

public class AverageRatingRangeDto
{
    public string Range { get; set; } = null!; // "1-2", "2-3", ...
    public int Count { get; set; }
}

public class BedsByMunicipalityDto
{
    public string Municipality { get; set; } = null!;
    public int TotalBeds { get; set; }
}

public class TopReviewedDto
{
    public string Name { get; set; } = null!;
    public int ReviewCount { get; set; }
    public double AverageRating { get; set; }
    public string Municipality { get; set; } = null!;
}