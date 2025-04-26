using System.ComponentModel.DataAnnotations;

namespace job_portal_api.Models
{
    public class Application
    {
        public int Id { get; set; }

        [Required]
        public required string CoverLetter { get; set; }

        public string? ResumeUrl { get; set; }
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public required string Status { get; set; } = "Pending"; // Pending, Reviewed, Accepted, Rejected

        // Foreign keys
        public int JobId { get; set; }
        public required Job Job { get; set; }

        public int ApplicantId { get; set; }
        public required User Applicant { get; set; }
    }
} 