// Dtos/CreateClubDto.cs
namespace Anweshon.Api.Dtos
{
    public class CreateClubDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
        public string? ContactEmail { get; set; }
        public string? WebsiteUrl { get; set; }

        // Extra club details
        public string? Tagline { get; set; }
        public int? FoundedYear { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? MeetingLocation { get; set; }
    }
}
