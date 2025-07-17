// Dynamic Relationships Engine for Impression
// Manages relationship formation, evolution, and Unit Profile creation

export interface DynamicRelationship {
  dynamic_id: string;
  users: string[];
  dynamic_type: 'First Flirt' | 'First Meet' | 'First Collab' | 'First Encounter' | 'First Sync';
  status: 'initiated' | 'active' | 'evolved' | 'dormant' | 'ended';
  created_at: string;
  expires_at?: string;
  messages_enabled: boolean;
  evolution_history: EvolutionEvent[];
  unit_profile?: UnitProfile;
  interaction_count: number;
  last_interaction: string;
}

export interface EvolutionEvent {
  event_id: string;
  event_type: 'window_opened' | 'window_extended' | 'unit_formed' | 'relationship_named' | 'status_changed';
  timestamp: string;
  data: Record<string, any>;
  triggered_by: string;
}

export interface UnitProfile {
  unit_id: string;
  unit_name: string;
  joint_image?: string;
  shared_bio?: string;
  unit_type: 'duo' | 'trio' | 'group';
  visibility: 'public' | 'limited' | 'private';
  interaction_style: 'separate' | 'unified' | 'alternating';
  created_at: string;
  members: UnitMember[];
}

export interface UnitMember {
  user_id: string;
  role: 'primary' | 'secondary' | 'equal';
  permissions: ('post' | 'respond' | 'manage')[];
  join_date: string;
}

export interface FirstWindow {
  window_id: string;
  dynamic_id: string;
  opened_at: string;
  expires_at: string;
  duration_hours: number;
  participants: string[];
  status: 'open' | 'expired' | 'converted' | 'abandoned';
  activity_log: WindowActivity[];
}

export interface WindowActivity {
  activity_id: string;
  participant_id: string;
  activity_type: 'entered' | 'left' | 'message_sent' | 'extension_requested' | 'formation_proposed';
  timestamp: string;
  data?: Record<string, any>;
}

export class DynamicEngine {
  private static readonly DYNAMICS_KEY = 'impression_dynamics';
  private static readonly WINDOWS_KEY = 'impression_first_windows';
  private static readonly UNITS_KEY = 'impression_unit_profiles';

  // Initiate a new dynamic relationship
  static initiateDynamic(
    userIds: string[],
    dynamicType: DynamicRelationship['dynamic_type'],
    initiatedBy: string
  ): DynamicRelationship {
    const dynamicId = this.generateDynamicId();
    const now = new Date();
    const expires = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours default

    const dynamic: DynamicRelationship = {
      dynamic_id: dynamicId,
      users: userIds,
      dynamic_type: dynamicType,
      status: 'initiated',
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
      messages_enabled: true,
      evolution_history: [{
        event_id: this.generateEventId(),
        event_type: 'window_opened',
        timestamp: now.toISOString(),
        data: { dynamic_type: dynamicType, duration_hours: 48 },
        triggered_by: initiatedBy
      }],
      interaction_count: 0,
      last_interaction: now.toISOString()
    };

    this.storeDynamic(dynamic);
    this.openFirstWindow(dynamic, initiatedBy);
    
    return dynamic;
  }

  // Open the First Window for a dynamic
  static openFirstWindow(dynamic: DynamicRelationship, initiatedBy: string): FirstWindow {
    const windowId = this.generateWindowId();
    const now = new Date();
    const expires = new Date(dynamic.expires_at || now.getTime() + 48 * 60 * 60 * 1000);

    const firstWindow: FirstWindow = {
      window_id: windowId,
      dynamic_id: dynamic.dynamic_id,
      opened_at: now.toISOString(),
      expires_at: expires.toISOString(),
      duration_hours: 48,
      participants: dynamic.users,
      status: 'open',
      activity_log: [{
        activity_id: this.generateActivityId(),
        participant_id: initiatedBy,
        activity_type: 'entered',
        timestamp: now.toISOString(),
        data: { message: `${this.getUserName(initiatedBy)} opened a ${dynamic.dynamic_type} window` }
      }]
    };

    this.storeFirstWindow(firstWindow);
    return firstWindow;
  }

  // Check if both users are in the window (triggers formation)
  static checkWindowFormation(windowId: string): boolean {
    const window = this.getFirstWindow(windowId);
    if (!window || window.status !== 'open') return false;

    const enteredUsers = new Set();
    window.activity_log.forEach(activity => {
      if (activity.activity_type === 'entered') {
        enteredUsers.add(activity.participant_id);
      } else if (activity.activity_type === 'left') {
        enteredUsers.delete(activity.participant_id);
      }
    });

    // If all participants are present, trigger formation
    if (enteredUsers.size === window.participants.length) {
      this.triggerDynamicFormation(window.dynamic_id);
      return true;
    }

    return false;
  }

  // Trigger dynamic formation
  static triggerDynamicFormation(dynamicId: string): DynamicRelationship | null {
    const dynamic = this.getDynamic(dynamicId);
    if (!dynamic) return null;

    // Update dynamic status
    dynamic.status = 'active';
    dynamic.evolution_history.push({
      event_id: this.generateEventId(),
      event_type: 'status_changed',
      timestamp: new Date().toISOString(),
      data: { from_status: 'initiated', to_status: 'active' },
      triggered_by: 'system'
    });

    this.storeDynamic(dynamic);

    // Close the first window
    const windows = this.getAllFirstWindows();
    const window = windows.find(w => w.dynamic_id === dynamicId);
    if (window) {
      window.status = 'converted';
      this.storeFirstWindow(window);
    }

    return dynamic;
  }

  // Create a Unit Profile for a dynamic
  static createUnitProfile(
    dynamicId: string,
    unitData: Partial<UnitProfile>,
    createdBy: string
  ): UnitProfile | null {
    const dynamic = this.getDynamic(dynamicId);
    if (!dynamic || dynamic.status !== 'active') return null;

    const unitId = this.generateUnitId();
    const now = new Date();

    const unitProfile: UnitProfile = {
      unit_id: unitId,
      unit_name: unitData.unit_name || `${dynamic.dynamic_type} Unit`,
      joint_image: unitData.joint_image,
      shared_bio: unitData.shared_bio,
      unit_type: dynamic.users.length === 2 ? 'duo' : dynamic.users.length === 3 ? 'trio' : 'group',
      visibility: unitData.visibility || 'public',
      interaction_style: unitData.interaction_style || 'unified',
      created_at: now.toISOString(),
      members: dynamic.users.map((userId, index) => ({
        user_id: userId,
        role: index === 0 ? 'primary' : 'equal',
        permissions: ['post', 'respond', 'manage'],
        join_date: now.toISOString()
      }))
    };

    // Update dynamic with unit profile
    dynamic.unit_profile = unitProfile;
    dynamic.status = 'evolved';
    dynamic.evolution_history.push({
      event_id: this.generateEventId(),
      event_type: 'unit_formed',
      timestamp: now.toISOString(),
      data: { unit_id: unitId, unit_name: unitProfile.unit_name },
      triggered_by: createdBy
    });

    this.storeDynamic(dynamic);
    this.storeUnitProfile(unitProfile);

    return unitProfile;
  }

  // Add activity to a First Window
  static addWindowActivity(
    windowId: string,
    participantId: string,
    activityType: WindowActivity['activity_type'],
    data?: Record<string, any>
  ): void {
    const window = this.getFirstWindow(windowId);
    if (!window || window.status !== 'open') return;

    const activity: WindowActivity = {
      activity_id: this.generateActivityId(),
      participant_id: participantId,
      activity_type: activityType,
      timestamp: new Date().toISOString(),
      data
    };

    window.activity_log.push(activity);
    this.storeFirstWindow(window);

    // Check for formation after activity
    this.checkWindowFormation(windowId);
  }

  // Extend a First Window
  static extendWindow(windowId: string, additionalHours: number, requestedBy: string): boolean {
    const window = this.getFirstWindow(windowId);
    if (!window || window.status !== 'open') return false;

    const currentExpiry = new Date(window.expires_at);
    const newExpiry = new Date(currentExpiry.getTime() + additionalHours * 60 * 60 * 1000);
    
    window.expires_at = newExpiry.toISOString();
    window.duration_hours += additionalHours;
    
    this.addWindowActivity(windowId, requestedBy, 'extension_requested', {
      additional_hours: additionalHours,
      new_expiry: newExpiry.toISOString()
    });

    return true;
  }

  // Get active dynamics for a user
  static getUserDynamics(userId: string): DynamicRelationship[] {
    const dynamics = this.getAllDynamics();
    return dynamics.filter(d => 
      d.users.includes(userId) && 
      ['initiated', 'active', 'evolved'].includes(d.status)
    );
  }

  // Get user's unit profiles
  static getUserUnitProfiles(userId: string): UnitProfile[] {
    const units = this.getAllUnitProfiles();
    return units.filter(u => 
      u.members.some(m => m.user_id === userId)
    );
  }

  // Storage methods
  private static storeDynamic(dynamic: DynamicRelationship): void {
    const dynamics = this.getAllDynamics();
    const index = dynamics.findIndex(d => d.dynamic_id === dynamic.dynamic_id);
    
    if (index >= 0) {
      dynamics[index] = dynamic;
    } else {
      dynamics.push(dynamic);
    }
    
    localStorage.setItem(this.DYNAMICS_KEY, JSON.stringify(dynamics));
  }

  private static storeFirstWindow(window: FirstWindow): void {
    const windows = this.getAllFirstWindows();
    const index = windows.findIndex(w => w.window_id === window.window_id);
    
    if (index >= 0) {
      windows[index] = window;
    } else {
      windows.push(window);
    }
    
    localStorage.setItem(this.WINDOWS_KEY, JSON.stringify(windows));
  }

  private static storeUnitProfile(unit: UnitProfile): void {
    const units = this.getAllUnitProfiles();
    const index = units.findIndex(u => u.unit_id === unit.unit_id);
    
    if (index >= 0) {
      units[index] = unit;
    } else {
      units.push(unit);
    }
    
    localStorage.setItem(this.UNITS_KEY, JSON.stringify(units));
  }

  // Retrieval methods
  static getDynamic(dynamicId: string): DynamicRelationship | null {
    const dynamics = this.getAllDynamics();
    return dynamics.find(d => d.dynamic_id === dynamicId) || null;
  }

  static getFirstWindow(windowId: string): FirstWindow | null {
    const windows = this.getAllFirstWindows();
    return windows.find(w => w.window_id === windowId) || null;
  }

  private static getAllDynamics(): DynamicRelationship[] {
    return JSON.parse(localStorage.getItem(this.DYNAMICS_KEY) || '[]');
  }

  private static getAllFirstWindows(): FirstWindow[] {
    return JSON.parse(localStorage.getItem(this.WINDOWS_KEY) || '[]');
  }

  private static getAllUnitProfiles(): UnitProfile[] {
    return JSON.parse(localStorage.getItem(this.UNITS_KEY) || '[]');
  }

  // Utility methods
  private static generateDynamicId(): string {
    return `dyn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateWindowId(): string {
    return `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateUnitId(): string {
    return `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateActivityId(): string {
    return `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getUserName(userId: string): string {
    // In a real app, this would fetch from user database
    const user = JSON.parse(localStorage.getItem('impression_user') || '{}');
    return user.email === userId ? user.name : 'User';
  }
}