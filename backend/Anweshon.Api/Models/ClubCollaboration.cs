namespace Anweshon.Api.Models
{
    public class ClubCollaboration
    {
        public int Id { get; set; }
        public int FromClubId { get; set; }
        public Club FromClub { get; set; } = null!;
        public int ToClubId { get; set; }
        public Club ToClub { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string? EventDetails { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
        public string? Response { get; set; }
    }
}