// ============================================================
// MahaSahayak AI — Mahakumbh 2028 — Type Definitions
// ============================================================

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type AvailabilityStatus = 'available' | 'busy' | 'offline' | 'on_break';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type CrowdDensity = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'responding' | 'resolved' | 'closed';
export type AssignmentPriority = 'low' | 'normal' | 'high' | 'emergency';
export type AssignmentStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type NotificationType = 'info' | 'warning' | 'emergency' | 'success' | 'assignment';

export interface Volunteer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  skills: string[];
  languages: string[];
  experience_level: ExperienceLevel;
  availability: AvailabilityStatus;
  preferred_zone?: string;
  assigned_zone?: string;
  workload_score: number;
  bharat_ready_score: number;
  hours_worked: number;
  active_assignments: number;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Zone {
  id: string;
  zone_name: string;
  zone_code: string;
  description?: string;
  required_skills: string[];
  current_volunteer_count: number;
  required_volunteer_count: number;
  risk_level: RiskLevel;
  crowd_density: CrowdDensity;
  latitude?: number;
  longitude?: number;
  manager_id?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Assignment {
  id: string;
  volunteer_id: string;
  zone_id: string;
  task?: string;
  skill_required?: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  ai_recommendation_reason?: string;
  confidence_score?: number;
  assigned_at: string;
  completed_at?: string;
  shift_start?: string;
  shift_end?: string;
  // Joined
  volunteer?: Volunteer;
  zone?: Zone;
}

export interface Incident {
  id: string;
  zone_id?: string;
  incident_type?: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  volunteers_assigned: number;
  reported_by?: string;
  ai_response_plan?: string;
  created_at: string;
  resolved_at?: string;
  // Joined
  zone?: Zone;
}

export interface Notification {
  id: string;
  recipient_id?: string;
  recipient_role?: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface ShiftLog {
  id: string;
  volunteer_id: string;
  zone_id: string;
  check_in: string;
  check_out?: string;
  hours_worked: number;
  tasks_completed: number;
}

// ============================================================
// AI API Response Types
// ============================================================

export interface AIAssignmentResponse {
  selected_volunteer_ids: string[];
  assignment_reasoning: Record<string, string>;
  shift_recommendation: 'morning' | 'afternoon' | 'evening';
  confidence_score: number;
  warnings: string[];
  coverage_summary: string;
}

export interface AIEmergencyResponse {
  primary_responders: string[];
  backup_responders: string[];
  estimated_response_time: string;
  action_plan: string[];
  risk_assessment: string;
  resource_requirements: string[];
  escalation_needed: boolean;
  command_center_alert: string;
}

export interface AIBalanceResponse {
  overall_health_score: number;
  health_status: string;
  burnout_risks: BurnoutRisk[];
  underutilized: UnderutilizedVolunteer[];
  rebalancing_suggestions: RebalancingSuggestion[];
  critical_alerts: string[];
  skill_gap_analysis: Record<string, string>;
}

export interface BurnoutRisk {
  volunteer_id: string;
  name: string;
  workload_score: number;
  risk_level: string;
  recommendation: string;
  suggested_replacement_skill: string;
}

export interface UnderutilizedVolunteer {
  volunteer_id: string;
  name: string;
  workload_score: number;
  suggested_action: string;
}

export interface RebalancingSuggestion {
  action: string;
  reason: string;
  impact: string;
}

export interface AIQueryResponse {
  matched_volunteer_ids: string[];
  search_interpretation: string;
  filters_applied: {
    skills: string[] | null;
    languages: string[] | null;
    availability: string | null;
    experience_level: string | null;
    zone: string | null;
  };
  total_matches: number;
  result_summary: string;
}

// ============================================================
// Utility Types
// ============================================================

export interface DashboardMetrics {
  totalVolunteers: number;
  activeVolunteers: number;
  availableVolunteers: number;
  openIncidents: number;
  coveragePercent: number;
  burnoutRisks: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'assignment' | 'incident' | 'checkin' | 'checkout' | 'alert' | 'ai';
  title: string;
  description: string;
  zone?: string;
  timestamp: string;
  severity?: IncidentSeverity;
}

export type UserRole = 'admin' | 'zone_manager' | 'volunteer';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone_id?: string;
  volunteer_id?: string;
}

export interface DemoScenario {
  title: string;
  zone: string;
  zone_id: string;
  type: string;
  severity: IncidentSeverity;
  description: string;
  volunteers_needed: number;
}
