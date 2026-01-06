using System;

namespace Anweshon.Api.Dtos
{
    public class UpdateEventDto
    {
        public int Id { get; set; }

        public int ClubId { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public string? EventType { get; set; }

        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }

        public string? Location { get; set; }

        public int? Capacity { get; set; }

        public decimal? Fee { get; set; }

        public string? BannerUrl { get; set; }
    }
}
