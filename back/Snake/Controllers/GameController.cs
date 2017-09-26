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
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> HighScores()
        {
            var scores = await _context.Scores
                                        .OrderByDescending(s => s.Points)
                                        .ThenBy(s => s.GridSize)
                                        .Take(20)
                                        .Include(s => s.User)
                                        .ToListAsync();
            return View(scores);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddHighScore([FromBody] Models.Score score)
        {
            int userId;

            if(!HttpContext.User.Identity.IsAuthenticated)
            {
                return StatusCode(400);
            }

            try
            {
                int.TryParse(HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid).Value, out userId);
            }
            catch
            {
                return StatusCode(400);
            }

            score.UserID = userId;
            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }
    }
}
