namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Site.Attributes;

[Area("Admin")]
[SabaAuth(Role = Role.Administrator)]
public class AdminController : Controller;