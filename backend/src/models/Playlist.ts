import { Schema, model, Document } from 'mongoose';

export interface IPlaylist extends Document {
  id: string;
  ownerId: string;
  type: 'AI' | 'USER' | 'CUSTOMISED';
  topicId: string;
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  items: Array<{
    id: string;
    videoId: string;
    position: number;
    purpose: string;
    coveredConcepts: string[];
  }>;
  coveredConcepts: string[];
  missingConcepts: string[];
  estimatedTotalMinutes: number;
  ratingAverage: number;
  ratingCount: number;
}

const PlaylistSchema = new Schema<IPlaylist>({
  id: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  type: { type: String, enum: ['AI', 'USER', 'CUSTOMISED'], default: 'USER' },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  visibility: { type: String, enum: ['public', 'unlisted', 'private'], default: 'public' },
  items: [{
    id: String,
    videoId: String,
    position: Number,
    purpose: String,
    coveredConcepts: [String]
  }],
  coveredConcepts: [String],
  missingConcepts: [String],
  estimatedTotalMinutes: { type: Number, default: 0 },
  ratingAverage: { type: Number, default: 5.0 },
  ratingCount: { type: Number, default: 1 }
}, { timestamps: true });

export const PlaylistModel = model<IPlaylist>('Playlist', PlaylistSchema);
