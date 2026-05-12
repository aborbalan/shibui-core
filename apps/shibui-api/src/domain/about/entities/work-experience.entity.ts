export class WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  /** Format: "YYYY-MM" */
  startDate: string;
  /** Format: "YYYY-MM" — null means current position */
  endDate: string | null;
  description: string;
  tags: string[];
  /** Controls display order (0 = most recent) */
  order: number;
}
