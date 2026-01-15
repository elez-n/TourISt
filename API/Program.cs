using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<TouristDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(opt =>
{
  opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
});
app.UseAuthorization();

app.MapControllers();

app.Run();
