import type { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "../../../repositories/UserRepository";
import { generateHash } from "../../../utils/crypt";

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
  const searchQuery = req.query.search as string | undefined;
  return UserRepository.findByNameAndEmail(searchQuery, searchQuery)
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: "No users found." });
      } else {
        return res.status(200).json(results);
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, email, password, gender, birthdate } = req.body;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const profileData = {
      name: username,
      gender: gender,
      birth_date: new Date(birthdate),
    };
    const authIdHash = await generateHash(email);
    const passwordHash = await generateHash(password);
    const authorizationData = {
      auth_id: authIdHash,
      password_hash: passwordHash,
    };
    const contactData = {
      email: email,
    };
    const savedUser = await UserRepository.create({
      profile: profileData,
      authorization: authorizationData,
      contacts: contactData,
    });
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save user." });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const userIds = req.body.userIds;
  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  return UserRepository.delete(userIds)
    .then(() => {
      return res.status(200).json({ message: "Users successfully deleted." });
    })
    .catch(() => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
}
