using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Snake.Models;
using Snake.Data;
using Microsoft.EntityFrameworkCore;
using Snake.Misc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace Snake.Controllers
{
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _context.Users.ToListAsync());
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register([Bind("Name,Password")] User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    user.Password = Helper.CalculateMD5Hash(user.Password);
                    _context.Add(user);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
            }
            catch (DbUpdateException)
            {
                ModelState.AddModelError("", "Unable to save changes to the database.");
            }

            return View(user);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([Bind("Name,Password")] User user)
        {
            int? userId;

            if (ModelState.IsValid)
            {
                userId = await LoginUserAsync(user.Name, user.Password);
                if (userId != null)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Sid, userId.ToString())
                    };

                    var userIdentity = new ClaimsIdentity(claims, "login");

                    ClaimsPrincipal principal = new ClaimsPrincipal(userIdentity);
                    await HttpContext.SignInAsync("CookieAuthenticationScheme", principal);

                    return RedirectToAction(nameof(Index));
                }
            }

            ViewData["Error"] = "Wrong password!";

            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("CookieAuthenticationScheme");
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private async Task<int?> LoginUserAsync(string username, string password)
        {
            var user = await _context.Users
                .Where(u => u.Name == username)
                .FirstOrDefaultAsync();

            if(user != null && user.Password == Helper.CalculateMD5Hash(password))
            {
                return user.ID;
            }

            return null;
        }
    }
}
