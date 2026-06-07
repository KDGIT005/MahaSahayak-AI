-- ============================================================
-- VolunteerAI — Mahakumbh 2028 — Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- VOLUNTEERS
-- ============================================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  age INTEGER,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  experience_level VARCHAR(20) DEFAULT 'beginner' CHECK (experience_level IN ('beginner','intermediate','expert')),
  availability VARCHAR(20) DEFAULT 'available' CHECK (availability IN ('available','busy','offline','on_break')),
  preferred_zone UUID,
  assigned_zone UUID,
  workload_score INTEGER DEFAULT 0 CHECK (workload_score BETWEEN 0 AND 100),
  bharat_ready_score FLOAT DEFAULT 0,
  hours_worked FLOAT DEFAULT 0,
  active_assignments INTEGER DEFAULT 0,
  latitude FLOAT DEFAULT 25.4358,
  longitude FLOAT DEFAULT 81.8463,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ZONES
-- ============================================================
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name VARCHAR(100) NOT NULL,
  zone_code VARCHAR(20) UNIQUE,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  current_volunteer_count INTEGER DEFAULT 0,
  required_volunteer_count INTEGER DEFAULT 10,
  risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low','medium','high','critical')),
  crowd_density VARCHAR(20) DEFAULT 'moderate' CHECK (crowd_density IN ('low','moderate','high','very_high','extreme')),
  latitude FLOAT,
  longitude FLOAT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
  task VARCHAR(200),
  skill_required VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low','normal','high','emergency')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending','active','completed','cancelled')),
  ai_recommendation_reason TEXT,
  confidence_score FLOAT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  shift_start TIMESTAMPTZ,
  shift_end TIMESTAMPTZ
);

-- ============================================================
-- INCIDENTS
-- ============================================================
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES zones(id),
  incident_type VARCHAR(100),
  description TEXT,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','responding','resolved','closed')),
  volunteers_assigned INTEGER DEFAULT 0,
  reported_by UUID,
  ai_response_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID,
  recipient_role VARCHAR(20),
  title VARCHAR(200),
  message TEXT,
  type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info','warning','emergency','success','assignment')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SHIFT LOGS
-- ============================================================
CREATE TABLE shift_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES volunteers(id),
  zone_id UUID REFERENCES zones(id),
  check_in TIMESTAMPTZ DEFAULT NOW(),
  check_out TIMESTAMPTZ,
  hours_worked FLOAT DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0
);

-- Enable Realtime on key tables
ALTER PUBLICATION supabase_realtime ADD TABLE volunteers;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
