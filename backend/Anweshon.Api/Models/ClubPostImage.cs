namespace Anweshon.Api.Models
{
    public class ClubPostImage
    {
        public int Id { get; set; }
        public int ClubPostId { get; set; }
        public ClubPost ClubPost { get; set; } = null!;
        
        public string ImageUrl { get; set; } = null!;
        public string? Caption { get; set; }
        public int DisplayOrder { get; set; } = 0;
    }
}
