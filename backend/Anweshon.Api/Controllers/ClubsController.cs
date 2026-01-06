using Anweshon.Api.Data;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.SignalR;
using Anweshon.Api.Hubs;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationsHub;

        public ClubsController(
            ApplicationDbContext context,
            IHubContext<NotificationHub> notificationsHub)
        {
            _context = context;
            _notificationsHub = notificationsHub;
        }

        // GET: api/Clubs - List all clubs (public)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ClubDetailsDto>>> GetAllClubs()
        {
            var clubs = await _context.Clubs.ToListAsync();

            var dtos = clubs.Select(club => new ClubDetailsDto
            {
                Id = club.Id,
                Name = club.Name,
                Description = club.Description,
                LogoUrl = club.LogoUrl,
                BannerUrl = club.BannerUrl,
                PrimaryColor = club.PrimaryColor,
                SecondaryColor = club.SecondaryColor,
                ContactEmail = club.ContactEmail,
                WebsiteUrl = club.WebsiteUrl,
                Tagline = club.Tagline,
                FoundedYear = club.FoundedYear,
                FacebookUrl = club.FacebookUrl,
                InstagramUrl = club.InstagramUrl,
                MeetingLocation = club.MeetingLocation
            });

            return Ok(dtos);
        }

        // GET: api/Clubs/{id}
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<ClubDetailsDto>> GetClub(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound();

            return Ok(new ClubDetailsDto
            {
                Id = club.Id,
                Name = club.Name,
                Description = club.Description,
                LogoUrl = club.LogoUrl,
                BannerUrl = club.BannerUrl,
                PrimaryColor = club.PrimaryColor,
                SecondaryColor = club.SecondaryColor,
                ContactEmail = club.ContactEmail,
                WebsiteUrl = club.WebsiteUrl,

                Tagline = club.Tagline,
                FoundedYear = club.FoundedYear,
                FacebookUrl = club.FacebookUrl,
                InstagramUrl = club.InstagramUrl,
                MeetingLocation = club.MeetingLocation
            });
        }

        // helper to get current user id
        private string? GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        // GET: api/Clubs/{id}/members
        [HttpGet("{id:int}/members")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult<IEnumerable<ClubMemberDto>>> GetMembers(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound("Club not found.");

            var members = await _context.Memberships
                .Include(m => m.User)
                .Where(m => m.ClubId == id)
                .OrderBy(m => m.JoinedAt)
                .Select(m => new ClubMemberDto
                {
                    MembershipId = m.Id,
                    UserId = m.UserId,
                    FullName = m.User.FullName,
                    Email = m.User.Email!,
                    RoleInClub = m.RoleInClub,
                    JoinedAt = m.JoinedAt
                })
                .ToListAsync();

            return Ok(members);
        }

        // GET: api/Clubs/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ClubDetailsDto>>> GetMyClubs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var clubs = await _context.Memberships
                .Include(m => m.Club)
                .Where(m => m.UserId == userId)
                .Select(m => m.Club)
                .Distinct()
                .ToListAsync();

            var dtos = clubs.Select(club => new ClubDetailsDto
            {
                Id = club.Id,
                Name = club.Name,
                Description = club.Description,
                LogoUrl = club.LogoUrl,
                BannerUrl = club.BannerUrl,
                PrimaryColor = club.PrimaryColor,
                SecondaryColor = club.SecondaryColor,
                ContactEmail = club.ContactEmail,
                WebsiteUrl = club.WebsiteUrl,

                Tagline = club.Tagline,
                FoundedYear = club.FoundedYear,
                FacebookUrl = club.FacebookUrl,
                InstagramUrl = club.InstagramUrl,
                MeetingLocation = club.MeetingLocation
            });

            return Ok(dtos);
        }

        // POST: api/Clubs
        [HttpPost]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> CreateClub(CreateClubDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var exists = await _context.Clubs
                .AnyAsync(c => c.Name == dto.Name);
            if (exists)
                return BadRequest("A club with this name already exists.");

            var club = new Club
            {
                Name = dto.Name,
                Description = dto.Description,
                LogoUrl = dto.LogoUrl,
                BannerUrl = dto.BannerUrl,
                PrimaryColor = dto.PrimaryColor,
                SecondaryColor = dto.SecondaryColor,
                ContactEmail = dto.ContactEmail,
                WebsiteUrl = dto.WebsiteUrl,

                Tagline = dto.Tagline,
                FoundedYear = dto.FoundedYear,
                FacebookUrl = dto.FacebookUrl,
                InstagramUrl = dto.InstagramUrl,
                MeetingLocation = dto.MeetingLocation
            };

            _context.Clubs.Add(club);
            await _context.SaveChangesAsync();

            // Automatically add creator as a member
            var membership = new Membership
            {
                ClubId = club.Id,
                UserId = userId,
                RoleInClub = "Admin",
                JoinedAt = DateTime.UtcNow
            };
            _context.Memberships.Add(membership);

            // Automatically add creator as an executive
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                var executive = new ClubExecutive
                {
                    ClubId = club.Id,
                    UserId = userId, // Link to the user who created the club
                    Name = user.FullName ?? user.Email ?? "Club Admin",
                    Position = "Founder",
                    Email = user.Email,
                    Phone = user.PhoneNumber,
                    DisplayOrder = 0
                };
                _context.ClubExecutives.Add(executive);
            }

            await _context.SaveChangesAsync();

            return Ok(new { club.Id });
        }

        // POST: api/Clubs/{id}/join
        [HttpPost("{id:int}/join")]
        [Authorize]
        public async Task<ActionResult> JoinClub(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound("Club not found.");

            var already = await _context.Memberships
                .AnyAsync(m => m.ClubId == id && m.UserId == userId);
            if (already)
                return BadRequest("You are already a member of this club.");

            var membership = new Membership
            {
                ClubId = id,
                UserId = userId,
                RoleInClub = "Member",
                JoinedAt = DateTime.UtcNow
            };

            _context.Memberships.Add(membership);
            await _context.SaveChangesAsync();

            // Send notification to club executives
            var user = await _context.Users.FindAsync(userId);
            var executives = await _context.ClubExecutives
                .Where(e => e.ClubId == id && !string.IsNullOrEmpty(e.UserId))
                .Select(e => e.UserId)
                .Distinct()
                .ToListAsync();

            foreach (var execUserId in executives)
            {
                await _notificationsHub.Clients.Group($"user_{execUserId}")
                    .SendAsync("ReceiveNotification", new
                    {
                        type = "member_joined",
                        title = "New Member",
                        message = $"{user?.UserName ?? user?.Email ?? "A user"} joined {club.Name}",
                        clubId = id,
                        clubName = club.Name,
                        timestamp = DateTime.UtcNow
                    });
            }

            return Ok(new { membership.Id });
        }

        // DELETE: api/Clubs/{id}/leave
        [HttpDelete("{id:int}/leave")]
        [Authorize]
        public async Task<ActionResult> LeaveClub(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var membership = await _context.Memberships
                .FirstOrDefaultAsync(m => m.ClubId == id && m.UserId == userId);

            if (membership == null)
                return NotFound("You are not a member of this club.");

            _context.Memberships.Remove(membership);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Clubs/{id}/executives
        [HttpGet("{id:int}/executives")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ClubExecutiveDto>>> GetExecutives(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound("Club not found.");

            var execs = await _context.ClubExecutives
                .Where(e => e.ClubId == id)
                .OrderBy(e => e.DisplayOrder)
                .ThenBy(e => e.Position)
                .ToListAsync();

            var dtos = execs.Select(e => new ClubExecutiveDto
            {
                Id = e.Id,
                ClubId = e.ClubId,
                Name = e.Name,
                Position = e.Position,
                Email = e.Email,
                Phone = e.Phone,
                PhotoUrl = e.PhotoUrl,
                DisplayOrder = e.DisplayOrder
            });

            return Ok(dtos);
        }

        // PUT: api/Clubs/{id}/executives
        [HttpPut("{id:int}/executives")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> UpsertExecutives(int id, UpsertClubExecutivesDto dto)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound("Club not found.");

            // Remove existing executives for this club
            var existing = await _context.ClubExecutives
                .Where(e => e.ClubId == id)
                .ToListAsync();

            _context.ClubExecutives.RemoveRange(existing);

            // Add new set
            foreach (var execDto in dto.Executives)
            {
                if (string.IsNullOrWhiteSpace(execDto.Name) ||
                    string.IsNullOrWhiteSpace(execDto.Position))
                {
                    continue; // skip invalid entries
                }

                var exec = new ClubExecutive
                {
                    ClubId = id,
                    Name = execDto.Name,
                    Position = execDto.Position,
                    Email = execDto.Email,
                    Phone = execDto.Phone,
                    PhotoUrl = execDto.PhotoUrl,
                    DisplayOrder = execDto.DisplayOrder
                };

                _context.ClubExecutives.Add(exec);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Clubs/{id}/members/me
        [HttpGet("{id:int}/members/me")]
        [Authorize]
        public async Task<ActionResult<MembershipDto?>> GetMyMembership(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var membership = await _context.Memberships
                .FirstOrDefaultAsync(m => m.ClubId == id && m.UserId == userId);

            if (membership == null)
                return Ok(null);

            var dto = new MembershipDto
            {
                ClubId = membership.ClubId,
                UserId = membership.UserId,
                RoleInClub = membership.RoleInClub,
                JoinedAt = membership.JoinedAt
            };

            return Ok(dto);
        }

        // PUT: api/Clubs/{id}/profile
        [HttpPut("{id:int}/profile")]
        [Authorize] // later restrict to club owners/admins
        public async Task<ActionResult> UpdateProfile(int id, UpdateClubProfileDto dto)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound();

            club.Description = dto.Description;
            club.LogoUrl = dto.LogoUrl;
            club.BannerUrl = dto.BannerUrl;
            club.PrimaryColor = dto.PrimaryColor;
            club.SecondaryColor = dto.SecondaryColor;
            club.ContactEmail = dto.ContactEmail;
            club.WebsiteUrl = dto.WebsiteUrl;

            club.Tagline = dto.Tagline;
            club.FoundedYear = dto.FoundedYear;
            club.FacebookUrl = dto.FacebookUrl;
            club.InstagramUrl = dto.InstagramUrl;
            club.MeetingLocation = dto.MeetingLocation;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
