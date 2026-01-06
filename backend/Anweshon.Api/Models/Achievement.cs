namespace Anweshon.Api.Models
{
    public class Achievement
    {
        public int Id { get; set; }

        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime AchievementDate { get; set; }
        
        // Enhanced fields
        public string AchievementType { get; set; } = "Club"; // Club, Member, Competition
        public string? MemberName { get; set; } // If member achievement
        public string? ImageUrl { get; set; } // Certificate/trophy photo
        
        // Submission tracking
        public string? SubmittedByUserId { get; set; }
        public ApplicationUser? SubmittedBy { get; set; }
        public string Status { get; set; } = "Approved"; // Pending, Approved, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
