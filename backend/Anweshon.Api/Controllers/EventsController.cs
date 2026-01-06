using Anweshon.Api.Data;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Anweshon.Api.Hubs;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationsHub;

        public EventsController(
            ApplicationDbContext context,
            IHubContext<NotificationHub> notificationsHub)
        {
            _context = context;
            _notificationsHub = notificationsHub;
        }

        // GET: api/Events/upcoming
        [HttpGet("upcoming")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventListItemDto>>> GetUpcomingEvents()
        {
            var now = DateTime.UtcNow;

            var events = await _context.Events
                .Include(e => e.Club)
                .Where(e => e.StartDateTime >= now && e.Status == "Published" && !e.IsArchived)
                .OrderBy(e => e.StartDateTime)
                .Select(e => new EventListItemDto
                {
                    Id = e.Id,
                    ClubId = e.ClubId,
                    ClubName = e.Club.Name,
                    Title = e.Title,
                    EventType = e.EventType,
                    StartDateTime = e.StartDateTime,
                    Status = e.Status,
                    BannerUrl = e.BannerUrl
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/Events/club/{clubId}
        [HttpGet("club/{clubId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventListItemDto>>> GetEventsForClub(int clubId)
        {
            var now = DateTime.UtcNow;

            var events = await _context.Events
                .Include(e => e.Club)
                .Where(e => e.ClubId == clubId &&
                            e.StartDateTime >= now &&
                            e.Status == "Published" &&
                            !e.IsArchived)
                .OrderBy(e => e.StartDateTime)
                .Select(e => new EventListItemDto
                {
                    Id = e.Id,
                    ClubId = e.ClubId,
                    ClubName = e.Club.Name,
                    Title = e.Title,
                    EventType = e.EventType,
                    StartDateTime = e.StartDateTime,
                    Status = e.Status,
                    BannerUrl = e.BannerUrl
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/Events/{id}
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<EventDetailsDto>> GetEventById(int id)
        {
            var e = await _context.Events
                .Include(ev => ev.Club)
                .FirstOrDefaultAsync(
                    ev => ev.Id == id && ev.Status == "Published");

            if (e == null)
                return NotFound();

            var dto = new EventDetailsDto
            {
                Id = e.Id,
                ClubId = e.ClubId,
                ClubName = e.Club.Name,
                Title = e.Title,
                Description = e.Description,
                EventType = e.EventType,
                StartDateTime = e.StartDateTime,
                EndDateTime = e.EndDateTime,
                Location = e.Location,
                Capacity = e.Capacity,
                Fee = e.Fee,
                Status = e.Status,
                BannerUrl = e.BannerUrl
            };

            return Ok(dto);
        }


        // POST: api/Events
        [HttpPost]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> CreateEvent(CreateEventDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var club = await _context.Clubs.FindAsync(dto.ClubId);
            if (club == null)
                return BadRequest("Club not found.");

            var entity = new Event
            {
                ClubId = dto.ClubId,
                Title = dto.Title,
                Description = dto.Description,
                EventType = dto.EventType,
                StartDateTime = dto.StartDateTime,
                EndDateTime = dto.EndDateTime,
                Location = dto.Location,
                Capacity = dto.Capacity,
                Fee = dto.Fee,
                BannerUrl = dto.BannerUrl,
                CreatedByUserId = userId,
                Status = "Published",
                IsArchived = dto.IsArchived, // Allow creating as archived (for past events)
                ShowInPastEvents = true
            };

            _context.Events.Add(entity);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                Title = "New event created",
                Message = $"{club.Name}: {entity.Title} on {entity.StartDateTime:g}",
                Type = "NewEvent"
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _notificationsHub.Clients.All.SendAsync("ReceiveNotification", new
            {
                title = notification.Title,
                message = notification.Message,
                type = notification.Type,
                createdAt = notification.CreatedAt
            });

            return Ok(new { entity.Id });
        }

        // PUT: api/Events/{id}
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult> UpdateEvent(int id, UpdateEventDto dto)
        {
            if (id != dto.Id)
                return BadRequest("Mismatched event id.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var entity = await _context.Events.FindAsync(id);
            if (entity == null)
                return NotFound();

            // Allow ClubAdmin or the creator to update
            var isClubAdmin = User.IsInRole("ClubAdmin");
            if (!isClubAdmin && entity.CreatedByUserId != userId)
                return Forbid();

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.EventType = dto.EventType;
            entity.StartDateTime = dto.StartDateTime;
            entity.EndDateTime = dto.EndDateTime;
            entity.Location = dto.Location;
            entity.Capacity = dto.Capacity;
            entity.Fee = dto.Fee;
            entity.BannerUrl = dto.BannerUrl;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Events/club/{clubId}/past
        [HttpGet("club/{clubId:int}/past")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventListItemDto>>> GetPastEventsForClub(int clubId)
        {
            var now = DateTime.UtcNow;

            var events = await _context.Events
                .Include(e => e.Club)
                .Where(e => e.ClubId == clubId &&
                            e.StartDateTime < now &&
                            e.Status == "Published" &&
                            !e.IsArchived &&
                            e.ShowInPastEvents)
                .OrderByDescending(e => e.StartDateTime)
                .Select(e => new EventListItemDto
                {
                    Id = e.Id,
                    ClubId = e.ClubId,
                    ClubName = e.Club.Name,
                    Title = e.Title,
                    EventType = e.EventType,
                    StartDateTime = e.StartDateTime,
                    Status = e.Status,
                    BannerUrl = e.BannerUrl
                })
                .ToListAsync();

            return Ok(events);
        }

        // DELETE: api/Events/{id} (Soft delete)
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> DeleteEvent(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var entity = await _context.Events.FindAsync(id);
            if (entity == null)
                return NotFound();

            if (entity.CreatedByUserId != userId)
                return Forbid();

            // Soft delete
            entity.IsArchived = true;
            entity.Status = "Deleted";
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
