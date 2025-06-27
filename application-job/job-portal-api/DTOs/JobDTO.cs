namespace job_portal_api.DTOs
{
    public class JobDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public string Type { get; set; }
        public string Salary { get; set; }
        public string Requirements { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime? Deadline { get; set; }
        public bool IsActive { get; set; }
    }
} 