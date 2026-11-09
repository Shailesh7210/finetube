import { Schema, model, Document } from 'mongoose';

export interface ISubject extends Document {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  parentSubjectId?: string | null;
  streams?: string[];
  status: 'active' | 'provisional' | 'archived';
  order?: number;
}

const SubjectSchema = new Schema<ISubject>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  icon: { type: String, default: 'BookOpen' },
  parentSubjectId: { type: String, default: null },
  streams: [{ type: String }],
  status: { type: String, enum: ['active', 'provisional', 'archived'], default: 'active' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const SubjectModel = model<ISubject>('Subject', SubjectSchema);
