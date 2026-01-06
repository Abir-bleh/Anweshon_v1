namespace Anweshon.Api.Dtos
{
    public class CreateEventRegistrationDto
    {
        public int EventId { get; set; }
    }

    public class EventRegistrationListItemDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string EventTitle { get; set; } = null!;
        public DateTime StartDateTime { get; set; }
        public string Status { get; set; } = null!;
    }
}
