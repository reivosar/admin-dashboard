export interface LogService {
  registerAuditLog(
    url: string,
    method: string,
    response_status: number,
    request_started_at: Date,
    request_ended_at: Date,
    user_id?: number,
    description?: string,
    parameters?: string,
    query?: string,
    ip_address?: string,
    response_message?: string
  ): Promise<void>;
}
