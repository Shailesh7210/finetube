/**
 * Blueprint Section 20 & 21: Unit Economics, Cost Metering & Tier Management
 */

export type UserTier = 'FREE' | 'PRO';

export interface TierLimits {
  tier: UserTier;
  maxAiQueriesDaily: number;
  maxAiNotesDaily: number;
  maxSandboxRunsDaily: number;
  features: string[];
}

export const TIER_CONFIGS: Record<UserTier, TierLimits> = {
  FREE: {
    tier: 'FREE',
    maxAiQueriesDaily: 25,
    maxAiNotesDaily: 10,
    maxSandboxRunsDaily: 50,
    features: [
      'Full distraction-free curriculum feed',
      'Personal timestamped notes & export',
      '50 daily sandboxed code executions',
      '25 daily grounded AI inquiries',
      '10 daily AI notes generations'
    ]
  },
  PRO: {
    tier: 'PRO',
    maxAiQueriesDaily: 250,
    maxAiNotesDaily: 100,
    maxSandboxRunsDaily: 200,
    features: [
      'Everything in Free tier',
      '250 daily grounded AI inquiries',
      '100 daily structured AI note generations',
      '200 daily sandboxed code executions',
      'Priority AI generation queues',
      'Deep architectural concept quizzes'
    ]
  }
};

// Estimated unit infrastructure costs ($ USD) per Blueprint Section 20.1
export const UNIT_COSTS = {
  COST_PER_AI_NOTE: 0.004,
  COST_PER_ASK_AI: 0.0015,
  COST_PER_QUIZ: 0.003,
  COST_PER_SANDBOX_RUN: 0.0005,
  COST_PER_1K_FEED_VIEWS: 0.002
};

interface UserUsage {
  userId: string;
  tier: UserTier;
  aiQueriesUsedToday: number;
  aiNotesUsedToday: number;
  sandboxRunsUsedToday: number;
  totalTokensConsumed: number;
  lastResetDate: string;
}

// In-memory usage meter
const usageStore: Map<string, UserUsage> = new Map();

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getOrCreateUsage(userId: string): UserUsage {
  const today = getTodayString();
  let usage = usageStore.get(userId);

  if (!usage) {
    usage = {
      userId,
      tier: 'FREE',
      aiQueriesUsedToday: 4,
      aiNotesUsedToday: 2,
      sandboxRunsUsedToday: 3,
      totalTokensConsumed: 3200,
      lastResetDate: today
    };
    usageStore.set(userId, usage);
  } else if (usage.lastResetDate !== today) {
    // Reset daily counters at midnight UTC
    usage.aiQueriesUsedToday = 0;
    usage.aiNotesUsedToday = 0;
    usage.sandboxRunsUsedToday = 0;
    usage.lastResetDate = today;
  }

  return usage;
}

export function getUserUsage(userId: string) {
  const usage = getOrCreateUsage(userId);
  const limits = TIER_CONFIGS[usage.tier];

  return {
    tier: usage.tier,
    limits,
    usage: {
      aiQueries: {
        used: usage.aiQueriesUsedToday,
        max: limits.maxAiQueriesDaily,
        remaining: Math.max(0, limits.maxAiQueriesDaily - usage.aiQueriesUsedToday)
      },
      aiNotes: {
        used: usage.aiNotesUsedToday,
        max: limits.maxAiNotesDaily,
        remaining: Math.max(0, limits.maxAiNotesDaily - usage.aiNotesUsedToday)
      },
      sandboxRuns: {
        used: usage.sandboxRunsUsedToday,
        max: limits.maxSandboxRunsDaily,
        remaining: Math.max(0, limits.maxSandboxRunsDaily - usage.sandboxRunsUsedToday)
      },
      totalTokensConsumed: usage.totalTokensConsumed
    },
    resetsAt: 'Midnight UTC'
  };
}

export function recordAiQuery(userId: string, tokens: number = 350): boolean {
  const usage = getOrCreateUsage(userId);
  const limits = TIER_CONFIGS[usage.tier];
  if (usage.aiQueriesUsedToday >= limits.maxAiQueriesDaily) {
    return false;
  }
  usage.aiQueriesUsedToday += 1;
  usage.totalTokensConsumed += tokens;
  return true;
}

export function recordAiNote(userId: string, tokens: number = 800): boolean {
  const usage = getOrCreateUsage(userId);
  const limits = TIER_CONFIGS[usage.tier];
  if (usage.aiNotesUsedToday >= limits.maxAiNotesDaily) {
    return false;
  }
  usage.aiNotesUsedToday += 1;
  usage.totalTokensConsumed += tokens;
  return true;
}

export function recordSandboxRun(userId: string): boolean {
  const usage = getOrCreateUsage(userId);
  const limits = TIER_CONFIGS[usage.tier];
  if (usage.sandboxRunsUsedToday >= limits.maxSandboxRunsDaily) {
    return false;
  }
  usage.sandboxRunsUsedToday += 1;
  return true;
}

export function setUserTier(userId: string, tier: UserTier) {
  const usage = getOrCreateUsage(userId);
  usage.tier = tier;
  return getUserUsage(userId);
}

export function getSystemUnitEconomics() {
  let totalQueries = 0;
  let totalNotes = 0;
  let totalRuns = 0;
  let totalTokens = 0;

  usageStore.forEach(u => {
    totalQueries += u.aiQueriesUsedToday;
    totalNotes += u.aiNotesUsedToday;
    totalRuns += u.sandboxRunsUsedToday;
    totalTokens += u.totalTokensConsumed;
  });

  const estimatedSpendUSD = 
    (totalNotes * UNIT_COSTS.COST_PER_AI_NOTE) +
    (totalQueries * UNIT_COSTS.COST_PER_ASK_AI) +
    (totalRuns * UNIT_COSTS.COST_PER_SANDBOX_RUN) +
    (totalTokens * 0.000002);

  return {
    totalTokensMetered: totalTokens,
    estimatedDailySpendUSD: Number(estimatedSpendUSD.toFixed(4)),
    averageCostPerActiveLearnerUSD: Number((estimatedSpendUSD / Math.max(1, usageStore.size)).toFixed(4)),
    breakdown: {
      aiNotesCost: Number((totalNotes * UNIT_COSTS.COST_PER_AI_NOTE).toFixed(4)),
      askAiCost: Number((totalQueries * UNIT_COSTS.COST_PER_ASK_AI).toFixed(4)),
      sandboxExecutionCost: Number((totalRuns * UNIT_COSTS.COST_PER_SANDBOX_RUN).toFixed(4))
    }
  };
}
