import { AuditLogRepository } from "@/repositories/log/audit-log-repository";
import { commandServiceOperation } from "../service-helper";

export const AuditLogService = {
  async createAPILog({
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
    return commandServiceOperation(async () => {
      return AuditLogRepository.saveAPIlog({
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
      });
    });
  },
};
