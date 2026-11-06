import { Schema, model, Document } from 'mongoose';

export interface IVideo extends Document {
  id: string;
  provider: string;
  providerVideoId: string;
  canonicalUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  durationSeconds: number;
  publishedAt: string;
  channelTitle: string;
  primaryTopicId: string;
  secondaryTopicIds: string[];
  topicCoverage: Array<{
    conceptId: string;
    conceptName: string;
    level: string;
    confidence: number;
    evidenceSegmentIds?: string[];
  }>;
  chapters: Array<{
    title: string;
    start: number;
    end: number;
  }>;
  aiAssessment: {
    evaluationVersion: string;
    clarity: number;
    accuracyEvidence: number;
    exampleQuality: number;
    completeness: number;
    limitations: string[];
    needsHumanReview: boolean;
  };
  ratingAverage: number;
  ratingCount: number;
  creatorTrust: number;
  reasonCodes: string[];
}

const VideoSchema = new Schema<IVideo>({
  id: { type: String, required: true, unique: true },
  provider: { type: String, default: 'youtube' },
  providerVideoId: { type: String, required: true },
  canonicalUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnailUrl: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  publishedAt: { type: String, required: true },
  channelTitle: { type: String, required: true },
  primaryTopicId: { type: String, required: true, index: true },
  secondaryTopicIds: [{ type: String }],
  topicCoverage: [{
    conceptId: String,
    conceptName: String,
    level: String,
    confidence: Number,
    evidenceSegmentIds: [String]
  }],
  chapters: [{
    title: String,
    start: Number,
    end: Number
  }],
  aiAssessment: {
    evaluationVersion: String,
    clarity: Number,
    accuracyEvidence: Number,
    exampleQuality: Number,
    completeness: Number,
    limitations: [String],
    needsHumanReview: Boolean
  },
  ratingAverage: { type: Number, default: 4.5 },
  ratingCount: { type: Number, default: 1 },
  creatorTrust: { type: Number, default: 0.9 },
  reasonCodes: [{ type: String }]
}, { timestamps: true });

export const VideoModel = model<IVideo>('Video', VideoSchema);
