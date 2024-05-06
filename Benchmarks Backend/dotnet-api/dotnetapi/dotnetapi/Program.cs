using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agrega servicios CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

//TAMA�O MAXIMO DE LOS ARCHIVOS
builder.Services.Configure<FormOptions>(x =>
{
    x.ValueLengthLimit = int.MaxValue;
    x.MultipartBodyLengthLimit = int.MaxValue; // Ajusta seg�n tus necesidades
    x.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Aumenta el tama�o m�ximo del cuerpo de la solicitud para soportar archivos grandes
    serverOptions.Limits.MaxRequestBodySize = 2L * 1024 * 1024 * 1024*3; // 2 GB

    // Aumenta los tiempos de espera para conexiones lentas
    serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(10);
    serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);

    // Configura el n�mero m�ximo de conexiones simult�neas
    serverOptions.Limits.MaxConcurrentConnections = 100;

    // Configura el n�mero m�ximo de solicitudes simult�neas por conexi�n
    serverOptions.Limits.MaxConcurrentUpgradedConnections = 100;

    // Ajusta el tama�o del buffer de entrada y salida
    serverOptions.Limits.Http2.InitialConnectionWindowSize = 128 * 1024; // Para HTTP/2
    serverOptions.Limits.Http2.InitialStreamWindowSize = 128 * 1024; // Para HTTP/2
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAnyOrigin"); //ACTIVA CORS

//// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
