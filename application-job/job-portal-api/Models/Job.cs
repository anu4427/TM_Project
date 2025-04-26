using System.ComponentModel.DataAnnotations;

namespace job_portal_api.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public required string Title { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Company { get; set; }

        [Required]
        public required string Location { get; set; }

        [Required]
        public required string Type { get; set; } // Full-time, Part-time, Contract, etc.

        [Required]
        public decimal Salary { get; set; }

        public string? Requirements { get; set; }
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime? Deadline { get; set; }
        public bool IsActive { get; set; } = true;

        // Foreign key
        public int EmployerId { get; set; }
        public required User Employer { get; set; }
    }
} 