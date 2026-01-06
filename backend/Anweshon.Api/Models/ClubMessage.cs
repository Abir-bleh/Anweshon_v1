namespace Anweshon.Api.Models
{
    public class ClubMessage
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsReadByAdmin { get; set; } = false;
        public string? AdminResponse { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}