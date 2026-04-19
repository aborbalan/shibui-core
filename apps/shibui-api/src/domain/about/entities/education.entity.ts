export class Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: number;
  endYear: number;
  /** Controls display order (0 = most recent) */
  order: number;
}
