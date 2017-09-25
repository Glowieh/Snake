using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Snake.Data;

namespace Snake.Controllers
{
    public class GameController : Controller
    {
        private readonly AppDbContext _context;

        public GameController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory() + "../../../front/build/", @"index.html"), "text/html");
        }

        [Authorize]
        public IActionResult HighScores()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddHighScore(int points)
        {
            int userId;

            try
            {
                int.TryParse(HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid).Value, out userId);
            }
            catch
            {
                return StatusCode(400);
            }

            _context.Scores.Add(new Models.Score { Points = points, UserID = userId });

            return StatusCode(201);
        }
    }
}
