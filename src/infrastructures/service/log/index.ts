import { LogService } from "@/app/services/log";
import { TYPES } from "@/container/types";
import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export class PrismaLogService implements LogService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async registerAuditLog(
    url: string,
    method: string,
    response_status: number,
    request_started_at: Date,
    request_ended_at: Date,
    user_id?: number | undefined,
    description?: string | undefined,
    parameters?: string | undefined,
    query?: string | undefined,
    ip_address?: string | undefined,
    response_message?: string | undefined
  ): Promise<void> {
    await this.prisma.auditLog.create({
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
  }
}
