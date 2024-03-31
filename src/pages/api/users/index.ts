import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/users/user-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const searchQuery = req.query["filter[searchTerm]"] as string | undefined;
  return (await UserService.getUserBySearchTerm(searchQuery)).toResponse(res);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password, gender, birthdate } = req.body.formData;
  return (
    await UserService.create(username, email, password, gender, birthdate)
  ).toResponse(res);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { userIds } = req.body;
  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  return (await UserService.delete(userIds)).toResponse(res);
}
