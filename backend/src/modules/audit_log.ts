import { db } from '../database/db.connection'; // Your drizzle instance
import { auditLogsSchema } from '../database/schema/audit_logs.schema'; // Adjust the import path as necessary

type AuditAction =
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'ENABLE_USER'
  | 'DISABLE_USER';

export async function createAuditLog({
  action,
  actor_user_id,
  target_user_id,
  changed_data,
}: {
  action: AuditAction;
  actor_user_id: string;
  target_user_id: string;
  changed_data: Record<string, any>;
}) {
  await db.insert(auditLogsSchema).values({
    action,
    actor_user_id,
    target_user_id,
    changed_data,
  });
}
