// AI NLP Analysis Engine for Bio Processing and Tone Analysis
// Simulates OpenAI/LLM integration for bio analysis and user compatibility

export interface BioAnalysis {
  user_id: string;
  bio_text: string;
  humor_score: number;
  confidence_score: number;
  vulnerability_score: number;
  creativity_score: number;
  emotional_tone: 'positive' | 'neutral' | 'negative' | 'complex';
  openness_score: number;
  tone_polarity: number; // -1 to 1
  keywords: string[];
  personality_markers: string[];
  intent_alignment: Record<string, number>;
}

export interface ToneCompatibility {
  user_a_id: string;
  user_b_id: string;
  humor_compatibility: number;
  emotional_resonance: number;
  communication_style_match: number;
  personality_complement: number;
  overall_compatibility: number;
}

export class AIEngine {
  private static readonly ANALYSIS_CACHE_KEY = 'impression_bio_analysis';
  private static readonly COMPATIBILITY_CACHE_KEY = 'impression_compatibility_cache';

  // Analyze user bio with simulated AI
  static async analyzeBio(userId: string, bioText: string): Promise<BioAnalysis> {
    // Check cache first
    const cached = this.getCachedAnalysis(userId);
    if (cached) return cached;

    // Simulate AI processing delay
    await this.simulateProcessingDelay();

    const analysis: BioAnalysis = {
      user_id: userId,
      bio_text: bioText,
      humor_score: this.analyzeHumor(bioText),
      confidence_score: this.analyzeConfidence(bioText),
      vulnerability_score: this.analyzeVulnerability(bioText),
      creativity_score: this.analyzeCreativity(bioText),
      emotional_tone: this.analyzeEmotionalTone(bioText),
      openness_score: this.analyzeOpenness(bioText),
      tone_polarity: this.analyzeTonePolarity(bioText),
      keywords: this.extractKeywords(bioText),
      personality_markers: this.extractPersonalityMarkers(bioText),
      intent_alignment: this.analyzeIntentAlignment(bioText)
    };

    this.cacheAnalysis(analysis);
    return analysis;
  }

  // Calculate compatibility between two users' bio analyses
  static calculateToneCompatibility(
    analysisA: BioAnalysis, 
    analysisB: BioAnalysis
  ): ToneCompatibility {
    const cacheKey = `${analysisA.user_id}_${analysisB.user_id}`;
    const cached = this.getCachedCompatibility(cacheKey);
    if (cached) return cached;

    const humorCompatibility = this.calculateHumorCompatibility(analysisA, analysisB);
    const emotionalResonance = this.calculateEmotionalResonance(analysisA, analysisB);
    const communicationStyleMatch = this.calculateCommunicationMatch(analysisA, analysisB);
    const personalityComplement = this.calculatePersonalityComplement(analysisA, analysisB);

    const overallCompatibility = (
      humorCompatibility * 0.25 +
      emotionalResonance * 0.35 +
      communicationStyleMatch * 0.25 +
      personalityComplement * 0.15
    );

    const compatibility: ToneCompatibility = {
      user_a_id: analysisA.user_id,
      user_b_id: analysisB.user_id,
      humor_compatibility: humorCompatibility,
      emotional_resonance: emotionalResonance,
      communication_style_match: communicationStyleMatch,
      personality_complement: personalityComplement,
      overall_compatibility: overallCompatibility
    };

    this.cacheCompatibility(cacheKey, compatibility);
    return compatibility;
  }

  // Analyze humor in text (simulated)
  private static analyzeHumor(text: string): number {
    const humorIndicators = [
      'lol', 'haha', 'funny', 'joke', 'laugh', 'hilarious', 
      'witty', 'sarcastic', 'ironic', '😂', '😄', '😆',
      'pun', 'clever', 'amusing', 'entertaining'
    ];
    
    const lowerText = text.toLowerCase();
    let humorScore = 0;
    
    humorIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) {
        humorScore += 0.15;
      }
    });

    // Length and punctuation patterns can indicate humor
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    
    if (exclamationCount > 2) humorScore += 0.1;
    if (questionCount > 1) humorScore += 0.1;

    return Math.min(humorScore, 1);
  }

  // Analyze confidence in text
  private static analyzeConfidence(text: string): number {
    const confidenceMarkers = [
      'confident', 'sure', 'definitely', 'absolutely', 'certainly',
      'accomplished', 'successful', 'proud', 'achieved', 'excel',
      'lead', 'manage', 'create', 'build', 'passionate'
    ];

    const uncertaintyMarkers = [
      'maybe', 'might', 'perhaps', 'possibly', 'hopefully',
      'trying', 'attempting', 'struggling', 'difficult', 'unsure'
    ];

    const lowerText = text.toLowerCase();
    let confidenceScore = 0.5; // Start neutral

    confidenceMarkers.forEach(marker => {
      if (lowerText.includes(marker)) {
        confidenceScore += 0.1;
      }
    });

    uncertaintyMarkers.forEach(marker => {
      if (lowerText.includes(marker)) {
        confidenceScore -= 0.1;
      }
    });

    return Math.min(Math.max(confidenceScore, 0), 1);
  }

  // Analyze vulnerability/openness in text
  private static analyzeVulnerability(text: string): number {
    const vulnerabilityMarkers = [
      'feel', 'feelings', 'emotional', 'heart', 'soul', 'deep',
      'share', 'open', 'honest', 'authentic', 'real', 'genuine',
      'vulnerable', 'sensitive', 'empathetic', 'caring', 'love',
      'fear', 'anxiety', 'worry', 'hope', 'dream', 'wish'
    ];

    const lowerText = text.toLowerCase();
    let vulnerabilityScore = 0;

    vulnerabilityMarkers.forEach(marker => {
      if (lowerText.includes(marker)) {
        vulnerabilityScore += 0.08;
      }
    });

    // Personal pronouns indicate openness
    const personalPronouns = ['i', 'me', 'my', 'myself'];
    personalPronouns.forEach(pronoun => {
      const matches = lowerText.match(new RegExp(`\\b${pronoun}\\b`, 'g'));
      if (matches) {
        vulnerabilityScore += matches.length * 0.02;
      }
    });

    return Math.min(vulnerabilityScore, 1);
  }

  // Analyze creativity in text
  private static analyzeCreativity(text: string): number {
    const creativityMarkers = [
      'create', 'creative', 'art', 'artist', 'design', 'music',
      'write', 'writer', 'imagination', 'innovative', 'unique',
      'original', 'inspiration', 'dream', 'vision', 'craft',
      'paint', 'draw', 'photography', 'dance', 'theater', 'film'
    ];

    const lowerText = text.toLowerCase();
    let creativityScore = 0;

    creativityMarkers.forEach(marker => {
      if (lowerText.includes(marker)) {
        creativityScore += 0.1;
      }
    });

    // Unusual word combinations or metaphors (basic detection)
    const unusualPhrases = ['like a', 'as if', 'reminds me of', 'kind of like'];
    unusualPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        creativityScore += 0.05;
      }
    });

    return Math.min(creativityScore, 1);
  }

  // Analyze emotional tone
  private static analyzeEmotionalTone(text: string): BioAnalysis['emotional_tone'] {
    const positiveWords = [
      'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful',
      'great', 'fantastic', 'awesome', 'brilliant', 'beautiful'
    ];

    const negativeWords = [
      'sad', 'angry', 'frustrated', 'difficult', 'hard', 'struggle',
      'pain', 'hurt', 'disappointed', 'worried', 'anxious'
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount * 2) return 'positive';
    if (negativeCount > positiveCount * 2) return 'negative';
    if (positiveCount > 0 && negativeCount > 0) return 'complex';
    return 'neutral';
  }

  // Analyze openness score
  private static analyzeOpenness(text: string): number {
    const opennessMarkers = [
      'open', 'new', 'experience', 'adventure', 'explore', 'discover',
      'learn', 'grow', 'change', 'different', 'variety', 'curious',
      'interested', 'willing', 'try', 'experiment', 'challenge'
    ];

    const lowerText = text.toLowerCase();
    let opennessScore = 0;

    opennessMarkers.forEach(marker => {
      if (lowerText.includes(marker)) {
        opennessScore += 0.1;
      }
    });

    return Math.min(opennessScore, 1);
  }

  // Analyze tone polarity (-1 to 1)
  private static analyzeTonePolarity(text: string): number {
    const emotionalTone = this.analyzeEmotionalTone(text);
    const confidenceScore = this.analyzeConfidence(text);
    
    switch (emotionalTone) {
      case 'positive': return 0.3 + (confidenceScore * 0.7);
      case 'negative': return -0.3 - (confidenceScore * 0.4);
      case 'complex': return (confidenceScore - 0.5) * 0.6;
      default: return (confidenceScore - 0.5) * 0.4;
    }
  }

  // Extract keywords (simplified)
  private static extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'their'];
    return words.filter(word => !stopWords.includes(word)).slice(0, 10);
  }

  // Extract personality markers
  private static extractPersonalityMarkers(text: string): string[] {
    const markers: string[] = [];
    
    if (this.analyzeHumor(text) > 0.5) markers.push('humorous');
    if (this.analyzeConfidence(text) > 0.6) markers.push('confident');
    if (this.analyzeVulnerability(text) > 0.5) markers.push('open');
    if (this.analyzeCreativity(text) > 0.6) markers.push('creative');
    if (this.analyzeOpenness(text) > 0.6) markers.push('adventurous');
    
    return markers;
  }

  // Analyze intent alignment
  private static analyzeIntentAlignment(text: string): Record<string, number> {
    return {
      romantic: this.checkIntentKeywords(text, ['love', 'relationship', 'partner', 'romance', 'date']),
      platonic: this.checkIntentKeywords(text, ['friend', 'friendship', 'social', 'hang out', 'buddy']),
      creative: this.checkIntentKeywords(text, ['create', 'art', 'project', 'collaborate', 'build']),
      professional: this.checkIntentKeywords(text, ['work', 'career', 'business', 'professional', 'network'])
    };
  }

  private static checkIntentKeywords(text: string, keywords: string[]): number {
    const lowerText = text.toLowerCase();
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 0.2;
    });
    return Math.min(score, 1);
  }

  // Compatibility calculation methods
  private static calculateHumorCompatibility(analysisA: BioAnalysis, analysisB: BioAnalysis): number {
    // Similar humor levels = good compatibility
    const humorDiff = Math.abs(analysisA.humor_score - analysisB.humor_score);
    return 1 - humorDiff;
  }

  private static calculateEmotionalResonance(analysisA: BioAnalysis, analysisB: BioAnalysis): number {
    // Compatible emotional tones and similar vulnerability levels
    const toneMatch = analysisA.emotional_tone === analysisB.emotional_tone ? 0.5 : 0;
    const vulnerabilityBalance = 1 - Math.abs(analysisA.vulnerability_score - analysisB.vulnerability_score);
    return toneMatch + (vulnerabilityBalance * 0.5);
  }

  private static calculateCommunicationMatch(analysisA: BioAnalysis, analysisB: BioAnalysis): number {
    const confidenceBalance = 1 - Math.abs(analysisA.confidence_score - analysisB.confidence_score);
    const opennessMatch = 1 - Math.abs(analysisA.openness_score - analysisB.openness_score);
    return (confidenceBalance + opennessMatch) / 2;
  }

  private static calculatePersonalityComplement(analysisA: BioAnalysis, analysisB: BioAnalysis): number {
    // Some differences can be complementary
    const creativityComplement = Math.min(
      analysisA.creativity_score + analysisB.creativity_score,
      2 - Math.abs(analysisA.creativity_score - analysisB.creativity_score)
    ) / 2;
    
    return creativityComplement;
  }

  // Cache management
  private static getCachedAnalysis(userId: string): BioAnalysis | null {
    const cache = JSON.parse(localStorage.getItem(this.ANALYSIS_CACHE_KEY) || '{}');
    return cache[userId] || null;
  }

  private static cacheAnalysis(analysis: BioAnalysis): void {
    const cache = JSON.parse(localStorage.getItem(this.ANALYSIS_CACHE_KEY) || '{}');
    cache[analysis.user_id] = analysis;
    localStorage.setItem(this.ANALYSIS_CACHE_KEY, JSON.stringify(cache));
  }

  private static getCachedCompatibility(cacheKey: string): ToneCompatibility | null {
    const cache = JSON.parse(localStorage.getItem(this.COMPATIBILITY_CACHE_KEY) || '{}');
    return cache[cacheKey] || null;
  }

  private static cacheCompatibility(cacheKey: string, compatibility: ToneCompatibility): void {
    const cache = JSON.parse(localStorage.getItem(this.COMPATIBILITY_CACHE_KEY) || '{}');
    cache[cacheKey] = compatibility;
    localStorage.setItem(this.COMPATIBILITY_CACHE_KEY, JSON.stringify(cache));
  }

  private static async simulateProcessingDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
}