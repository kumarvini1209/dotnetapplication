using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
var databaseConnection = builder.Configuration.GetConnectionString("CatalogDatabase")
    ?? "Data Source=catalog.db";
builder.Services.AddDbContext<CatalogDbContext>(options =>
{
    if (databaseConnection.StartsWith("Host=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(databaseConnection);
    }
    else
    {
        options.UseSqlite(databaseConnection);
    }
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
    database.Database.EnsureCreated();

    if (!database.Products.Any())
    {
        database.Products.AddRange(
            new Product { Name = "Field Notes", Category = "Stationery", Price = 12.50m, InStock = true },
            new Product { Name = "Canvas Tote", Category = "Accessories", Price = 28.00m, InStock = true },
            new Product { Name = "Desk Lamp", Category = "Home", Price = 64.00m, InStock = false });
        database.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("LocalFrontend");

app.MapGet("/api/status", () =>
{
    return Results.Ok(new
    {
        service = "catalog-api",
        status = "healthy",
        environment = app.Environment.EnvironmentName,
        checkedAt = DateTimeOffset.UtcNow
    });
})
.WithName("GetStatus");

app.MapGet("/api/products", async (CatalogDbContext database) =>
    Results.Ok(await database.Products.AsNoTracking().OrderBy(product => product.Id).ToListAsync()))
    .WithName("GetProducts");

app.MapPost("/api/products", async (ProductRequest request, CatalogDbContext database) =>
{
    var product = new Product
    {
        Name = request.Name,
        Category = request.Category,
        Price = request.Price,
        InStock = request.InStock
    };

    database.Products.Add(product);
    await database.SaveChangesAsync();
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithName("CreateProduct");

app.MapPut("/api/products/{id:int}", async (int id, ProductRequest request, CatalogDbContext database) =>
{
    var product = await database.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    product.Name = request.Name;
    product.Category = request.Category;
    product.Price = request.Price;
    product.InStock = request.InStock;
    await database.SaveChangesAsync();
    return Results.Ok(product);
})
.WithName("UpdateProduct");

app.MapDelete("/api/products/{id:int}", async (int id, CatalogDbContext database) =>
{
    var product = await database.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    database.Products.Remove(product);
    await database.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteProduct");

app.Run();

record ProductRequest(string Name, string Category, decimal Price, bool InStock);
