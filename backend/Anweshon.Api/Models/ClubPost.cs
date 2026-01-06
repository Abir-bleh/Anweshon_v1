namespace Anweshon.Api.Models
{
    public class ClubPost
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;
        
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string PostType { get; set; } = "Photo"; // Photo, Announcement, Achievement
        
        public string CreatedByUserId { get; set; } = null!;
        public string? CreatedById { get; set; } // Foreign key for CreatedBy navigation
        public ApplicationUser? CreatedBy { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public ICollection<ClubPostImage> Images { get; set; } = new List<ClubPostImage>();
    }
}
