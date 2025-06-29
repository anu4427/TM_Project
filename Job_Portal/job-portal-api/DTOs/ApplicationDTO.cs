namespace job_portal_api.DTOs
{
    public class ApplicationDTO
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; }
        public string Company { get; set; }
        public string ApplicantName { get; set; }
        public string CoverLetter { get; set; }
        public string ResumeUrl { get; set; }
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; }
    }
} 