namespace Anweshon.Api.Models
{
    public class EventRegistration
    {
        public int Id { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Confirmed";
    }
}
