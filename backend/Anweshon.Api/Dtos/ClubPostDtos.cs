namespace Anweshon.Api.Dtos
{
    public class CreateClubPostDto
    {
        public int ClubId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string PostType { get; set; } = "Photo";
        public List<string> ImageUrls { get; set; } = new();
        public List<string> Captions { get; set; } = new();
    }

    public class ClubPostDto
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string PostType { get; set; } = "Photo";
        public string CreatedByUserId { get; set; } = string.Empty;
        public string CreatedByName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<ClubPostImageDto> Images { get; set; } = new();
    }

    public class ClubPostImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int DisplayOrder { get; set; }
    }
}
