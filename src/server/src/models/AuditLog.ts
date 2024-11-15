import { Schema, model, Document } from 'mongoose';

export interface AuditLogEntry extends Document {
  userId: string;
  action: string;
  resourceId: string;
  details: Record<string, any>;
  createdAt: Date;
}

const auditLogSchema = new Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  resourceId: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const AuditLog = model<AuditLogEntry>('AuditLog', auditLogSchema); 