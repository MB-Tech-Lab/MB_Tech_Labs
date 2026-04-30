export interface PerformanceMetrics {
  tasksCompleted: number;
  hoursLogged: number;
  qualityScore: number; // 0-100
}

export interface Report {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  metrics: PerformanceMetrics;
}
