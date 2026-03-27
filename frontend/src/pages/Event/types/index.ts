export interface Event {
  id: number;
  alertName: string;
  status: string;
  severity: string;
  description: string;
  source: string;
  instance: string;
  timestamp: string;
  linkedIncidentId: number | null;
  companyId?: string;
}

export type EventSeverity = 'critical' | 'warning' | 'info';
export type EventStatus = 'firing' | 'resolved';
