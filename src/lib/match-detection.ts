// Match Detection Engine - Integrates all systems for real-time matching
// Orchestrates behavioral tracking, AI analysis, and dynamic formation

import { BehavioralEngine, ResonanceScore, BehavioralVector } from './behavioral-engine';
import { AIEngine, BioAnalysis, ToneCompatibility } from './ai-nlp';
import { DynamicEngine, DynamicRelationship } from './dynamic-relationships';

export interface MatchDetectionResult {
  is_match: boolean;
  match_score: number;
  match_type: 'romantic' | 'platonic' | 'creative' | 'undefined' | 'sync';
  confidence_level: number;
  dynamic_label: string;
  reasoning: string[];
  should_initiate: boolean;
  estimated_compatibility: number;
}

export interface UserProfile {
  user_id: string;
  name: string;
  bio: string;
  intents: string[];
  age: number;
  email: string;
}

export class MatchDetector {
  private static readonly MATCH_HISTORY_KEY = 'impression_match_history';
  private static readonly COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

  // Main entry point - process a profile view and check for matches
  static async processProfileView(
    viewerProfile: UserProfile,
    targetProfile: UserProfile,
    behaviorData: Partial<BehavioralVector>
  ): Promise<MatchDetectionResult | null> {
    try {
      // 1. Generate and store behavioral vector
      const behavioralVector = BehavioralEngine.generateVector(
        targetProfile.user_id,
        viewerProfile.user_id,
        behaviorData
      );
      BehavioralEngine.storeVector(behavioralVector);

      // 2. Check for mutual behavioral resonance
      const resonanceScore = BehavioralEngine.checkMutualResonance(
        viewerProfile.user_id,
        targetProfile.user_id
      );

      if (!resonanceScore) {
        return null; // No mutual viewing yet
      }

      // 3. Perform AI bio analysis if not cached
      const [viewerAnalysis, targetAnalysis] = await Promise.all([
        AIEngine.analyzeBio(viewerProfile.user_id, viewerProfile.bio),
        AIEngine.analyzeBio(targetProfile.user_id, targetProfile.bio)
      ]);

      // 4. Calculate tone compatibility
      const toneCompatibility = AIEngine.calculateToneCompatibility(
        viewerAnalysis,
        targetAnalysis
      );

      // 5. Generate comprehensive match result
      const matchResult = this.generateMatchResult(
        viewerProfile,
        targetProfile,
        resonanceScore,
        toneCompatibility,
        viewerAnalysis,
        targetAnalysis
      );

      // 6. If match threshold is met, initiate dynamic
      if (matchResult.should_initiate) {
        await this.initiateDynamicMatch(
          viewerProfile,
          targetProfile,
          matchResult
        );
      }

      // 7. Store match result
      this.storeMatchResult(viewerProfile.user_id, targetProfile.user_id, matchResult);

      return matchResult;

    } catch (error) {
      console.error('Error in match detection:', error);
      return null;
    }
  }

  // Generate comprehensive match result
  private static generateMatchResult(
    viewerProfile: UserProfile,
    targetProfile: UserProfile,
    resonanceScore: ResonanceScore,
    toneCompatibility: ToneCompatibility,
    viewerAnalysis: BioAnalysis,
    targetAnalysis: BioAnalysis
  ): MatchDetectionResult {
    // Combine scores with weights
    const weights = {
      behavioral: 0.4,
      tone: 0.3,
      intent: 0.2,
      demographics: 0.1
    };

    const behavioralScore = resonanceScore.overall_score;
    const toneScore = toneCompatibility.overall_compatibility;
    const intentScore = this.calculateIntentAlignment(viewerProfile, targetProfile);
    const demographicScore = this.calculateDemographicCompatibility(viewerProfile, targetProfile);

    const overallScore = 
      behavioralScore * weights.behavioral +
      toneScore * weights.tone +
      intentScore * weights.intent +
      demographicScore * weights.demographics;

    const matchType = this.determineMatchType(
      resonanceScore.match_type,
      viewerProfile.intents,
      targetProfile.intents,
      viewerAnalysis,
      targetAnalysis
    );

    const dynamicLabel = this.generateDynamicLabel(matchType, overallScore);
    const reasoning = this.generateMatchReasoning(
      resonanceScore,
      toneCompatibility,
      viewerAnalysis,
      targetAnalysis
    );

    return {
      is_match: overallScore >= 0.72,
      match_score: overallScore,
      match_type: matchType,
      confidence_level: this.calculateConfidence(resonanceScore, toneCompatibility),
      dynamic_label: dynamicLabel,
      reasoning,
      should_initiate: overallScore >= 0.72 && !this.isInCooldown(viewerProfile.user_id, targetProfile.user_id),
      estimated_compatibility: overallScore
    };
  }

  // Determine the most appropriate match type
  private static determineMatchType(
    behavioralType: ResonanceScore['match_type'],
    viewerIntents: string[],
    targetIntents: string[],
    viewerAnalysis: BioAnalysis,
    targetAnalysis: BioAnalysis
  ): MatchDetectionResult['match_type'] {
    // Intent-based matching
    const sharedIntents = viewerIntents.filter(intent => targetIntents.includes(intent));
    
    if (sharedIntents.includes('romantic')) return 'romantic';
    if (sharedIntents.includes('creative')) return 'creative';
    if (sharedIntents.includes('platonic')) return 'platonic';

    // Fallback to behavioral type
    return behavioralType;
  }

  // Generate dynamic relationship label
  private static generateDynamicLabel(
    matchType: MatchDetectionResult['match_type'],
    score: number
  ): string {
    const intensity = score > 0.9 ? 'Intense' : score > 0.8 ? 'Strong' : 'Emerging';
    
    switch (matchType) {
      case 'romantic':
        return 'First Flirt';
      case 'creative':
        return 'First Collab';
      case 'platonic':
        return 'First Meet';
      case 'sync':
        return 'First Sync';
      default:
        return 'First Encounter';
    }
  }

  // Generate human-readable match reasoning
  private static generateMatchReasoning(
    resonanceScore: ResonanceScore,
    toneCompatibility: ToneCompatibility,
    viewerAnalysis: BioAnalysis,
    targetAnalysis: BioAnalysis
  ): string[] {
    const reasoning: string[] = [];

    // Behavioral resonance
    if (resonanceScore.behavioral_similarity > 0.8) {
      reasoning.push('Strong subconscious behavioral alignment detected');
    }
    if (resonanceScore.mutual_interest_score > 0.7) {
      reasoning.push('Mutual interest patterns show high compatibility');
    }

    // Tone compatibility
    if (toneCompatibility.emotional_resonance > 0.8) {
      reasoning.push('Emotional communication styles are highly compatible');
    }
    if (toneCompatibility.humor_compatibility > 0.7) {
      reasoning.push('Humor and playfulness levels align well');
    }

    // Personality insights
    const personalityMatch = this.analyzePersonalityMatch(viewerAnalysis, targetAnalysis);
    if (personalityMatch.length > 0) {
      reasoning.push(...personalityMatch);
    }

    // Content analysis
    if (resonanceScore.content_resonance > 0.8) {
      reasoning.push('Bio content shows strong thematic resonance');
    }

    return reasoning.slice(0, 4); // Limit to top 4 reasons
  }

  // Analyze personality compatibility
  private static analyzePersonalityMatch(
    viewerAnalysis: BioAnalysis,
    targetAnalysis: BioAnalysis
  ): string[] {
    const insights: string[] = [];

    const creativityDiff = Math.abs(viewerAnalysis.creativity_score - targetAnalysis.creativity_score);
    if (creativityDiff < 0.3) {
      insights.push('Similar creative energy and expression styles');
    }

    const vulnerabilityBalance = Math.abs(viewerAnalysis.vulnerability_score - targetAnalysis.vulnerability_score);
    if (vulnerabilityBalance < 0.2) {
      insights.push('Balanced emotional openness and authenticity');
    }

    const confidenceComplement = viewerAnalysis.confidence_score + targetAnalysis.confidence_score;
    if (confidenceComplement > 1.2 && confidenceComplement < 1.8) {
      insights.push('Complementary confidence levels create good balance');
    }

    return insights;
  }

  // Calculate intent alignment score
  private static calculateIntentAlignment(
    viewerProfile: UserProfile,
    targetProfile: UserProfile
  ): number {
    const viewerIntents = new Set(viewerProfile.intents);
    const targetIntents = new Set(targetProfile.intents);
    const intersection = new Set([...viewerIntents].filter(x => targetIntents.has(x)));
    const union = new Set([...viewerIntents, ...targetIntents]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  // Calculate demographic compatibility (age, etc.)
  private static calculateDemographicCompatibility(
    viewerProfile: UserProfile,
    targetProfile: UserProfile
  ): number {
    const ageDiff = Math.abs(viewerProfile.age - targetProfile.age);
    const ageScore = Math.max(0, 1 - (ageDiff / 20)); // Penalize large age gaps
    
    return ageScore;
  }

  // Calculate overall confidence level
  private static calculateConfidence(
    resonanceScore: ResonanceScore,
    toneCompatibility: ToneCompatibility
  ): number {
    return (resonanceScore.confidence_level + toneCompatibility.overall_compatibility) / 2;
  }

  // Initiate a dynamic relationship
  private static async initiateDynamicMatch(
    viewerProfile: UserProfile,
    targetProfile: UserProfile,
    matchResult: MatchDetectionResult
  ): Promise<DynamicRelationship> {
    const dynamicType = matchResult.dynamic_label as DynamicRelationship['dynamic_type'];
    
    const dynamic = DynamicEngine.initiateDynamic(
      [viewerProfile.user_id, targetProfile.user_id],
      dynamicType,
      viewerProfile.user_id
    );

    // Log the successful match
    console.log(`Dynamic initiated: ${dynamic.dynamic_id} - ${dynamicType} between ${viewerProfile.name} and ${targetProfile.name}`);
    
    return dynamic;
  }

  // Check if users are in cooldown period
  private static isInCooldown(userAId: string, userBId: string): boolean {
    const matchHistory = this.getMatchHistory();
    const key = [userAId, userBId].sort().join('_');
    const lastMatch = matchHistory[key];
    
    if (!lastMatch) return false;
    
    const cooldownEnd = new Date(lastMatch.timestamp).getTime() + this.COOLDOWN_PERIOD;
    return Date.now() < cooldownEnd;
  }

  // Store match result
  private static storeMatchResult(
    userAId: string,
    userBId: string,
    result: MatchDetectionResult
  ): void {
    const matchHistory = this.getMatchHistory();
    const key = [userAId, userBId].sort().join('_');
    
    matchHistory[key] = {
      timestamp: new Date().toISOString(),
      result,
      users: [userAId, userBId]
    };
    
    localStorage.setItem(this.MATCH_HISTORY_KEY, JSON.stringify(matchHistory));
  }

  // Get match history
  private static getMatchHistory(): Record<string, any> {
    return JSON.parse(localStorage.getItem(this.MATCH_HISTORY_KEY) || '{}');
  }

  // Get user's recent matches
  static getUserMatches(userId: string): MatchDetectionResult[] {
    const matchHistory = this.getMatchHistory();
    const userMatches: MatchDetectionResult[] = [];
    
    Object.values(matchHistory).forEach((entry: any) => {
      if (entry.users.includes(userId) && entry.result.is_match) {
        userMatches.push(entry.result);
      }
    });
    
    return userMatches.sort((a, b) => b.match_score - a.match_score);
  }
}