import { ServerResponse } from "http";

class SSEManager {
  private clients: ServerResponse[] = [];

  constructor() {}

  addClient(
    response: ServerResponse,
    onData: () => Promise<any | any[]>,
    interval = 1000
  ) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    this.clients.push(response);

    const intervalId = setInterval(async () => {
      try {
        const results = await onData();
        for (const data of results) {
          response.write(`data: ${JSON.stringify(data)}\n\n`);
        }
      } catch (error) {
        console.error("Error during data transmission:", error);
        this.sendError(response, error);
      }
    }, interval);

    response.on("close", () => {
      clearInterval(intervalId);
      this.removeClient(response);
      response.end();
    });
  }

  removeClient(response: ServerResponse) {
    const index = this.clients.indexOf(response);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  broadcast(message: any) {
    this.clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }

  private sendError(response: ServerResponse, error: any) {
    if (!response.writableEnded) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.write(
        "Error processing request: " + (error.message || "Unknown error")
      );
      response.end();
    }
    this.removeClient(response);
  }
}

export const sseManager = new SSEManager();
