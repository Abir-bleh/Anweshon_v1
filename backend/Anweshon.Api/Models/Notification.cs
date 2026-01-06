namespace Anweshon.Api.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public string? UserId { get; set; }  // null => broadcast
        public ApplicationUser? User { get; set; }

        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Type { get; set; } = "System";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
