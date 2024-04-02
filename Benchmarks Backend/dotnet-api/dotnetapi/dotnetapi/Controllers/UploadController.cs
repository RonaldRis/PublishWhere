using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace dotnetapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {
        // Define la carpeta multimedia una sola vez.
        private static readonly string multimediaDir = Path.Combine(Directory.GetCurrentDirectory(), "multimedia");

        static UploadController()
        {
            if (!Directory.Exists(multimediaDir))
            {
                Directory.CreateDirectory(multimediaDir);
            }
        }

        [HttpPost]
        [RequestSizeLimit(bytes: 2_147_483_648)]
        public async Task<IActionResult> Post(IFormFile image, IFormFile video, [FromForm] string id)
        {
            if (image == null && video == null)
            {
                return BadRequest(new { status = "Error", message = "No se proporcionaron archivos." });
            }

            try
            {
                if (image != null)
                {
                    await SaveFile(image, id, "img", multimediaDir);
                }

                if (video != null)
                {
                    await SaveFile(video, id, "vid", multimediaDir);
                }

                return Ok(new { status = "Ok" });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = "Error", message = "No se pudieron guardar los archivos." });
            }
        }

        private async Task SaveFile(IFormFile file, string id, string prefix, string directory)
        {
            string fileName = GenerateFileName(id, prefix, Path.GetExtension(file.FileName));
            string filePath = Path.Combine(directory, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        private string GenerateFileName(string id, string prefix, string extension)
        {
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            return $"{id}_{prefix}_{timestamp}{extension}";
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "Ok" });
        }
    }
}
