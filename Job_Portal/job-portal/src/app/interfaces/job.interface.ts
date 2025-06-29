export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  companyId: string | number;
  salary?: string;
  deadline?: Date;
} 