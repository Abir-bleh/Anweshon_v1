namespace Anweshon.Api.Dtos
{
    public class CreateAchievementDto
    {
        public int ClubId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime AchievementDate { get; set; }
        public string AchievementType { get; set; } = "Club";
        public string? MemberName { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class AchievementDto
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime AchievementDate { get; set; }
        public string AchievementType { get; set; } = "Club";
        public string? MemberName { get; set; }
        public string? ImageUrl { get; set; }
        public string? SubmittedByUserId { get; set; }
        public string? SubmittedByName { get; set; }
        public string Status { get; set; } = "Approved";
        public DateTime CreatedAt { get; set; }
    }
}
