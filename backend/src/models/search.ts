import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchResultItem {
  profileId: mongoose.Types.ObjectId;
  similarity: number;
  confidence: string;
}

export interface ISearchRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  searchImage: string;
  results: ISearchResultItem[];
  status: string;
  processingTimeMs?: number;
  createdAt: Date;
}

const searchResultItemSchema = new Schema<ISearchResultItem>({
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  similarity: { type: Number, required: true },
  confidence: { type: String, required: true },
});

const searchRequestSchema = new Schema<ISearchRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    searchImage: { type: String, required: true },
    results: [searchResultItemSchema],
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'processing', 'completed', 'failed'] },
    processingTimeMs: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

searchRequestSchema.index({ userId: 1 });
searchRequestSchema.index({ createdAt: -1 });

export const SearchRequest = mongoose.model<ISearchRequest>('SearchRequest', searchRequestSchema);
