import prisma from "../prisma";

export const AuditLogRepository = {
  async saveAPIlog({
    url,
    method,
    user_id,
    description,
    parameters,
    query,
    ip_address,
    response_status,
    response_message,
    request_started_at,
    request_ended_at,
  }: {
    url: string;
    method: string;
    user_id?: number;
    description?: string;
    parameters?: string;
    query?: string;
    ip_address?: string;
    response_status: number;
    response_message?: string;
    request_started_at: Date;
    request_ended_at: Date;
  }) {
    return await prisma.auditLog.create({
      data: {
        url: url,
        method: method,
        user_id: user_id,
        description: description,
        parameters: parameters,
        query: query,
        ip_address: ip_address,
        response_status: response_status,
        response_message: response_message,
        request_started_at: request_started_at,
        request_ended_at: request_ended_at,
      },
    });
  },
};
