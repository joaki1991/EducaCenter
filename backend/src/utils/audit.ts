import prisma from '../config/prisma.js';

// Create audit log entry
export const createAuditLog = async (data: {
  userId: string;
  companyId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
}): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        companyId: data.companyId || null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        metadata: data.metadata || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging shouldn't break the main operation
  }
};
