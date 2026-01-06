using Anweshon.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Anweshon.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Club> Clubs => Set<Club>();
        public DbSet<Membership> Memberships => Set<Membership>();
        public DbSet<Event> Events => Set<Event>();
        public DbSet<EventRegistration> EventRegistrations { get; set; }
        public DbSet<Achievement> Achievements => Set<Achievement>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<ClubExecutive> ClubExecutives { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }
        public DbSet<ClubCollaboration> ClubCollaborations { get; set; }
        public DbSet<ClubMessage> ClubMessages { get; set; }
        public DbSet<ClubPost> ClubPosts { get; set; }
        public DbSet<ClubPostImage> ClubPostImages { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Event fee precision
            builder.Entity<Event>()
                .Property(e => e.Fee)
                .HasPrecision(18, 2);

            // Club–Event relation (optional but clear)
            builder.Entity<Event>()
                .HasOne(e => e.Club)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.ClubId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Membership>()
        .HasIndex(m => new { m.ClubId, m.UserId })
        .IsUnique();

            // EventRegistration relations
            builder.Entity<EventRegistration>()
                .HasOne(er => er.Event)
                .WithMany(e => e.Registrations)
                .HasForeignKey(er => er.EventId)
                .OnDelete(DeleteBehavior.Restrict); // as you had, to avoid multiple cascade paths

builder.Entity<ClubExecutive>()
    .HasIndex(e => new { e.ClubId, e.Position, e.Name });

builder.Entity<EventRegistration>()
        .HasIndex(r => new { r.EventId, r.UserId })
        .IsUnique();

            builder.Entity<EventRegistration>()
                .HasOne(er => er.User)
                .WithMany() // or .WithMany(u => u.EventRegistrations) if you add collection on ApplicationUser
                .HasForeignKey(er => er.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClubCollaborations - prevent multiple cascade paths
            builder.Entity<ClubCollaboration>()
                .HasOne(cc => cc.FromClub)
                .WithMany()
                .HasForeignKey(cc => cc.FromClubId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ClubCollaboration>()
                .HasOne(cc => cc.ToClub)
                .WithMany()
                .HasForeignKey(cc => cc.ToClubId)
                .OnDelete(DeleteBehavior.NoAction); // Prevent multiple cascade paths
        }
    }
}
