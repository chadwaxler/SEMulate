using Microsoft.AspNetCore.Mvc;
using SEMulate.API.Services;

namespace SEMulate.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SemulateController : ControllerBase
{
  private readonly ILogger<SemulateController> _logger;
  private readonly SEMulateService _semulate;

  public SemulateController(ILogger<SemulateController> logger, SEMulateService semulate)
  {
    _logger = logger;
    _semulate = semulate;
  }

  [HttpGet]
  public IActionResult Get(int scanWidth = 400, int numberOfElectrons = 1000, int numberOfLines = 3)
  {
    var parameters = new SEMulateParameters
    {
      ScanWidth = scanWidth,
      NumberOfElectrons = numberOfElectrons,
      NumberOfLines = numberOfLines
    };
    var data = _semulate.Run(parameters);
    return Ok(data);
  }
}
