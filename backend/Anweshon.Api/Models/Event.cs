using System;
using System.Collections.Generic;

namespace Anweshon.Api.Models
{
    public class Event
    {
        public int Id { get; set; }

        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? EventType { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
        public decimal? Fee { get; set; }

        public string CreatedByUserId { get; set; } = null!;
        public ApplicationUser CreatedByUser { get; set; } = null!;

        public string Status { get; set; } = "Published"; // Published, Draft, Deleted
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Enhanced fields
        public string? BannerUrl { get; set; } // Event banner image
        public bool IsArchived { get; set; } = false; // Soft delete
        public bool ShowInPastEvents { get; set; } = true; // Display in past events showcase

        // IMPORTANT: navigation for registrations
        public ICollection<EventRegistration> Registrations { get; set; } = new List<EventRegistration>();
    }
}
