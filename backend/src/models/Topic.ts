import { Schema, model, Document } from 'mongoose';

export interface ITopic extends Document {
  id: string;
  subjectId: string;
  parentId?: string | null;
  slug: string;
  name: string;
  description: string;
  aliases: string[];
  status: 'active' | 'provisional' | 'archived';
  conceptChecklist: string[];
  educationLevel?: string;
  stream?: string;
  subtopics?: string[];
  domain?: string;
}

const TopicSchema = new Schema<ITopic>({
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true, index: true },
  parentId: { type: String, default: null, index: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  aliases: [{ type: String }],
  status: { type: String, enum: ['active', 'provisional', 'archived'], default: 'active' },
  conceptChecklist: [{ type: String }],
  educationLevel: { type: String, default: null },
  stream: { type: String, default: null },
  subtopics: [{ type: String }],
  domain: { type: String, default: null },
}, { timestamps: true });

export const TopicModel = model<ITopic>('Topic', TopicSchema);
