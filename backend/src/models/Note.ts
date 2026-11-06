import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  id: string;
  ownerId: string;
  folderId?: string;
  source?: {
    type: string;
    videoId?: string;
    topicId?: string;
    timestampSeconds?: number;
  };
  type: 'PERSONAL' | 'AI_GENERATED';
  title: string;
  topicIds: string[];
  content: {
    text?: string;
    sections?: Array<{
      heading: string;
      body: string;
      codeSnippet?: string;
      sourceSegmentIds?: string[];
      timestampSeconds?: number;
    }>;
  };
  tags: string[];
}

const NoteSchema = new Schema<INote>({
  id: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true, index: true },
  folderId: { type: String, default: 'f_notes' },
  source: {
    type: { type: String, default: 'video' },
    videoId: String,
    topicId: String,
    timestampSeconds: Number
  },
  type: { type: String, enum: ['PERSONAL', 'AI_GENERATED'], default: 'PERSONAL' },
  title: { type: String, required: true },
  topicIds: [{ type: String }],
  content: {
    text: String,
    sections: [{
      heading: String,
      body: String,
      codeSnippet: String,
      sourceSegmentIds: [String],
      timestampSeconds: Number
    }]
  },
  tags: [{ type: String }]
}, { timestamps: true });

export const NoteModel = model<INote>('Note', NoteSchema);
