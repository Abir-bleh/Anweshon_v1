using Microsoft.AspNetCore.Identity;

namespace Anweshon.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? StudentId { get; set; }
        public string? Department { get; set; }
        // Role will be from Identity roles, so no extra Role property here
    }
}
