import { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/users/user-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      return handleGet(Number(id), req, res);
    case "PUT":
      return handlePut(Number(id), req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(
  id: number,
  req: NextApiRequest,
  res: NextApiResponse
) {
  return (await UserService.getUser(id)).toResponse(res);
}

async function handlePut(
  id: number,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, email, gender, birthdate } = req.body.formData;
  return (
    await UserService.update(id, username, email, gender, birthdate)
  ).toResponse(res);
}
