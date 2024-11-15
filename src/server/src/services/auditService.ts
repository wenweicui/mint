import { AuditLog, AuditLogEntry } from '../models/AuditLog';

interface CreateAuditLogParams {
  userId: string;
  action: string;
  resourceId: string;
  details?: Record<string, any>;
}

export async function createAuditLog({
  userId,
  action,
  resourceId,
  details = {}
}: CreateAuditLogParams): Promise<AuditLogEntry> {
  const auditLog = new AuditLog({
    userId,
    action,
    resourceId,
    details
  });

  return await auditLog.save();
}

export async function getAuditLogs(
  filters: Partial<Pick<AuditLogEntry, 'userId' | 'action' | 'resourceId'>> = {}
): Promise<AuditLogEntry[]> {
  return AuditLog.find(filters).sort({ createdAt: -1 });
}