// Behavioral Vector Engine for Impression
// Tracks and analyzes user behavior for subconscious matching

export interface BehavioralVector {
  target_id: string;
  viewer_id: string;
  dwell_ms: number;
  scroll_reversals: number;
  scroll_events: number;
  avg_scroll_intensity: number;
  touch_intensity?: 'low' | 'medium' | 'high';
  content_tone_resonance?: number;
  return_behavior: boolean;
  last_action: 'viewed' | 'returned' | 'skipped';
  timestamp: string;
  session_id: string;
}

export interface ResonanceScore {
  user_a_id: string;
  user_b_id: string;
  behavioral_similarity: number;
  mutual_interest_score: number;
  content_resonance: number;
  overall_score: number;
  match_type: 'romantic' | 'platonic' | 'creative' | 'undefined' | 'sync';
  confidence_level: number;
}

export class BehavioralEngine {
  private static RESONANCE_THRESHOLD = 0.72;
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Generate normalized behavioral vector
  static generateVector(
    targetId: string, 
    viewerId: string, 
    behaviorData: Partial<BehavioralVector>
  ): BehavioralVector {
    const sessionId = this.getSessionId();
    
    return {
      target_id: targetId,
      viewer_id: viewerId,
      dwell_ms: behaviorData.dwell_ms || 0,
      scroll_reversals: behaviorData.scroll_reversals || 0,
      scroll_events: behaviorData.scroll_events || 0,
      avg_scroll_intensity: behaviorData.avg_scroll_intensity || 0,
      touch_intensity: this.calculateTouchIntensity(behaviorData.avg_scroll_intensity || 0),
      content_tone_resonance: Math.random() * 0.4 + 0.6, // Stub for AI analysis
      return_behavior: this.checkReturnBehavior(viewerId, targetId),
      last_action: behaviorData.last_action || 'viewed',
      timestamp: new Date().toISOString(),
      session_id: sessionId
    };
  }

  // Calculate cosine similarity between two behavioral vectors
  static calculateSimilarity(vectorA: BehavioralVector, vectorB: BehavioralVector): number {
    // Normalize dwell time (0-1 scale, cap at 30 seconds)
    const dwellA = Math.min(vectorA.dwell_ms / 30000, 1);
    const dwellB = Math.min(vectorB.dwell_ms / 30000, 1);

    // Normalize scroll behavior
    const scrollA = Math.min(vectorA.scroll_reversals / 10, 1);
    const scrollB = Math.min(vectorB.scroll_reversals / 10, 1);

    // Normalize intensity
    const intensityA = vectorA.avg_scroll_intensity / 100;
    const intensityB = vectorB.avg_scroll_intensity / 100;

    // Weight components
    const weights = {
      dwell: 0.4,
      scroll: 0.2,
      intensity: 0.2,
      content: 0.2
    };

    const similarity = 
      weights.dwell * (1 - Math.abs(dwellA - dwellB)) +
      weights.scroll * (1 - Math.abs(scrollA - scrollB)) +
      weights.intensity * (1 - Math.abs(intensityA - intensityB)) +
      weights.content * (vectorA.content_tone_resonance || 0) * (vectorB.content_tone_resonance || 0);

    return Math.min(Math.max(similarity, 0), 1);
  }

  // Check for mutual resonance and generate match
  static checkMutualResonance(userAId: string, userBId: string): ResonanceScore | null {
    const vectors = this.getStoredVectors();
    
    const vectorA = vectors.find(v => v.viewer_id === userAId && v.target_id === userBId);
    const vectorB = vectors.find(v => v.viewer_id === userBId && v.target_id === userAId);

    if (!vectorA || !vectorB) {
      return null; // Need mutual viewing
    }

    const behavioralSimilarity = this.calculateSimilarity(vectorA, vectorB);
    const mutualInterestScore = this.calculateMutualInterest(vectorA, vectorB);
    const contentResonance = (vectorA.content_tone_resonance || 0) * (vectorB.content_tone_resonance || 0);
    
    const overallScore = (behavioralSimilarity * 0.5) + (mutualInterestScore * 0.3) + (contentResonance * 0.2);
    
    if (overallScore >= this.RESONANCE_THRESHOLD) {
      return {
        user_a_id: userAId,
        user_b_id: userBId,
        behavioral_similarity: behavioralSimilarity,
        mutual_interest_score: mutualInterestScore,
        content_resonance: contentResonance,
        overall_score: overallScore,
        match_type: this.inferMatchType(vectorA, vectorB),
        confidence_level: overallScore
      };
    }

    return null;
  }

  // Infer match type based on behavioral patterns
  private static inferMatchType(vectorA: BehavioralVector, vectorB: BehavioralVector): ResonanceScore['match_type'] {
    const avgDwell = (vectorA.dwell_ms + vectorB.dwell_ms) / 2;
    const avgScrollReversals = (vectorA.scroll_reversals + vectorB.scroll_reversals) / 2;
    const avgContentResonance = ((vectorA.content_tone_resonance || 0) + (vectorB.content_tone_resonance || 0)) / 2;

    // High dwell + high scroll reversals = romantic interest
    if (avgDwell > 10000 && avgScrollReversals > 3) {
      return 'romantic';
    }

    // Medium dwell + high content resonance = creative collaboration
    if (avgDwell > 5000 && avgContentResonance > 0.8) {
      return 'creative';
    }

    // Moderate engagement = platonic
    if (avgDwell > 3000) {
      return 'platonic';
    }

    // Abstract patterns = sync
    if (avgScrollReversals > 5 || avgContentResonance > 0.9) {
      return 'sync';
    }

    return 'undefined';
  }

  // Calculate mutual interest score
  private static calculateMutualInterest(vectorA: BehavioralVector, vectorB: BehavioralVector): number {
    let score = 0;

    // Both have significant dwell time
    if (vectorA.dwell_ms > 5000 && vectorB.dwell_ms > 5000) {
      score += 0.4;
    }

    // Both show return behavior
    if (vectorA.return_behavior && vectorB.return_behavior) {
      score += 0.3;
    }

    // Similar scroll patterns
    const scrollDiff = Math.abs(vectorA.scroll_reversals - vectorB.scroll_reversals);
    if (scrollDiff <= 2) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  // Utility functions
  private static calculateTouchIntensity(avgIntensity: number): 'low' | 'medium' | 'high' {
    if (avgIntensity > 70) return 'high';
    if (avgIntensity > 30) return 'medium';
    return 'low';
  }

  private static checkReturnBehavior(viewerId: string, targetId: string): boolean {
    const vectors = this.getStoredVectors();
    return vectors.some(v => v.viewer_id === viewerId && v.target_id === targetId);
  }

  private static getSessionId(): string {
    let sessionId = localStorage.getItem('impression_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('impression_session_id', sessionId);
    }
    return sessionId;
  }

  private static getStoredVectors(): BehavioralVector[] {
    return JSON.parse(localStorage.getItem('impression_behavioral_vectors') || '[]');
  }

  // Store behavioral vector
  static storeVector(vector: BehavioralVector): void {
    const vectors = this.getStoredVectors();
    vectors.push(vector);
    
    // Keep only recent vectors (last 1000 or 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const filteredVectors = vectors
      .filter(v => v.timestamp > oneDayAgo)
      .slice(-1000);
    
    localStorage.setItem('impression_behavioral_vectors', JSON.stringify(filteredVectors));
  }

  // Get potential matches for a user
  static getPotentialMatches(userId: string): ResonanceScore[] {
    const vectors = this.getStoredVectors();
    const userVectors = vectors.filter(v => v.viewer_id === userId);
    const matches: ResonanceScore[] = [];

    userVectors.forEach(vector => {
      const match = this.checkMutualResonance(userId, vector.target_id);
      if (match) {
        matches.push(match);
      }
    });

    return matches.sort((a, b) => b.overall_score - a.overall_score);
  }
}
