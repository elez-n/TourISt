using Dipl.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<TouristDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("https://localhost:3000") // frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // za cookie-based refresh token
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("ReactApp");
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles(); 

app.Run();
