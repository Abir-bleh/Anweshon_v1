using Anweshon.Api.Data;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubPostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClubPostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string? GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        // GET: api/ClubPosts/club/{clubId}
        [HttpGet("club/{clubId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ClubPostDto>>> GetClubPosts(int clubId)
        {
            var posts = await _context.ClubPosts
                .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
                .Include(p => p.CreatedBy)
                .Where(p => p.ClubId == clubId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ClubPostDto
                {
                    Id = p.Id,
                    ClubId = p.ClubId,
                    Title = p.Title,
                    Description = p.Description,
                    PostType = p.PostType,
                    CreatedByUserId = p.CreatedByUserId,
                    CreatedByName = p.CreatedBy.FullName ?? p.CreatedBy.UserName ?? "Unknown",
                    CreatedAt = p.CreatedAt,
                    Images = p.Images.Select(i => new ClubPostImageDto
                    {
                        Id = i.Id,
                        ImageUrl = i.ImageUrl,
                        Caption = i.Caption,
                        DisplayOrder = i.DisplayOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }

        // POST: api/ClubPosts
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ClubPostDto>> CreatePost(CreateClubPostDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Check if user is ClubAdmin, member, or executive of the club
            var isClubAdmin = User.IsInRole("ClubAdmin");
            
            var isMember = await _context.Memberships
                .AnyAsync(m => m.ClubId == dto.ClubId && m.UserId == userId);
            
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == dto.ClubId && e.UserId == userId);

            if (!isClubAdmin && !isMember && !isExecutive)
                return Forbid();

            var post = new ClubPost
            {
                ClubId = dto.ClubId,
                Title = dto.Title,
                Description = dto.Description,
                PostType = dto.PostType,
                CreatedByUserId = userId,
                CreatedById = userId, // Set the foreign key for navigation property
                CreatedAt = DateTime.UtcNow
            };

            _context.ClubPosts.Add(post);
            await _context.SaveChangesAsync();

            // Add images
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                var image = new ClubPostImage
                {
                    ClubPostId = post.Id,
                    ImageUrl = dto.ImageUrls[i],
                    Caption = i < dto.Captions.Count ? dto.Captions[i] : null,
                    DisplayOrder = i
                };
                _context.ClubPostImages.Add(image);
            }

            await _context.SaveChangesAsync();

            // Reload with images
            var createdPost = await _context.ClubPosts
                .Include(p => p.Images)
                .Include(p => p.CreatedBy)
                .FirstAsync(p => p.Id == post.Id);

            var result = new ClubPostDto
            {
                Id = createdPost.Id,
                ClubId = createdPost.ClubId,
                Title = createdPost.Title,
                Description = createdPost.Description,
                PostType = createdPost.PostType,
                CreatedByUserId = createdPost.CreatedByUserId,
                CreatedByName = createdPost.CreatedBy?.FullName ?? createdPost.CreatedBy?.UserName ?? "Unknown",
                CreatedAt = createdPost.CreatedAt,
                Images = createdPost.Images.Select(i => new ClubPostImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    Caption = i.Caption,
                    DisplayOrder = i.DisplayOrder
                }).ToList()
            };

            return Ok(result);
        }

        // DELETE: api/ClubPosts/{id}
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> DeletePost(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var post = await _context.ClubPosts
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();

            // Only creator or club executives can delete
            var isCreator = post.CreatedByUserId == userId;
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == post.ClubId && e.UserId == userId);

            if (!isCreator && !isExecutive)
                return Forbid();

            _context.ClubPostImages.RemoveRange(post.Images);
            _context.ClubPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
