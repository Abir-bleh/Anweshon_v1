namespace Anweshon.Api.Models
{
    public class Club
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? ShortCode { get; set; }

        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Customization fields
        public string? BannerUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
        public string? ContactEmail { get; set; }
        public string? WebsiteUrl { get; set; }

        // NEW extra-details fields
        public string? Tagline { get; set; }
        public int? FoundedYear { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? MeetingLocation { get; set; }

        public ICollection<Membership> Memberships { get; set; } = new List<Membership>();
        public ICollection<Event> Events { get; set; } = new List<Event>();
        public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
    }
}
