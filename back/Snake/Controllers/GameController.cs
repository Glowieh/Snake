using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authorization;

namespace Snake.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory() + "../../../front/build/", @"index.html"), "text/html");
        }

        [Authorize]
        public IActionResult HighScores()
        {
            return View();
        }
    }
}
