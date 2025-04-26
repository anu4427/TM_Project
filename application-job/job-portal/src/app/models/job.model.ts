export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary?: string;
  postedDate: Date;
  deadline?: Date;
} 