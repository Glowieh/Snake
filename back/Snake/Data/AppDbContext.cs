using Snake.Models;
using Microsoft.EntityFrameworkCore;

namespace Snake.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Score> Scores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Score>()
                .HasOne(s => s.User)
                .WithMany(u => u.Scores)
                .HasForeignKey(s => s.UserID)
                .HasConstraintName("ForeignKey_User_Post");

            modelBuilder.Entity<Score>()
                .Property(s => s.GridSize)
                .HasComputedColumnSql("[GridWidth] * [GridHeight]");
        }
    }
}