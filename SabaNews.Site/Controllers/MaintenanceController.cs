namespace SabaNews.Site.Controllers;

using Microsoft.AspNetCore.Mvc;

[Route("/maintenance")]
public class MaintenanceController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}