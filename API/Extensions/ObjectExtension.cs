using System;
using API.Entities;

namespace API.Extensions;

public static class ObjectExtension
{
  public static IQueryable<TouristObject> Filter(this IQueryable<TouristObject> query,
      string? vrsta)
  {
    var vrstaList = new List<string>();

    if (!string.IsNullOrEmpty(vrsta))
    {
      vrstaList.AddRange([.. vrsta.Split(',')]);
    }
    query = query.Where(x => vrstaList.Count == 0 || vrstaList.Contains(x.ObjectType.Name));

    return query;
  }
  public static IQueryable<TouristObject> Sort(this IQueryable<TouristObject> query, string? orderBy)
  {

    query = orderBy switch
    {
      "beds" => query.OrderBy(x => x.NumberOfBeds),
      "bedsdesc" => query.OrderByDescending(x => x.NumberOfBeds),
      _ => query.OrderBy(x => x.Name)
    };
    return query;
  }

  public static IQueryable<TouristObject> Search(this IQueryable<TouristObject> query, string? searchTerm)
  {
    if (string.IsNullOrEmpty(searchTerm)) return query;
    var lowerCaseSearchTerm = searchTerm.ToLower();

    return query.Where(x =>
    x.Name.ToLower().Contains(lowerCaseSearchTerm)
);

  }
}