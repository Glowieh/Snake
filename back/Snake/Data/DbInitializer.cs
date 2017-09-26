using Snake.Models;
using System;
using System.Linq;
using Snake.Misc;

namespace Snake.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var users = new User[]
            {
                new User{ Name="admin", Password=Helper.CalculateMD5Hash("admin") }
            };

            foreach (User u in users)
            {
                context.Users.Add(u);
            }
            context.SaveChanges();

            var scores = new Score[]
            {
                new Score{ Points=1, UserID=1, GridWidth=20, GridHeight=20 }
            };

            foreach (Score s in scores)
            {
                context.Scores.Add(s);
            }
            context.SaveChanges();
        }
    }
}