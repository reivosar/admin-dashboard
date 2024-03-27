import { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "@/repositories/users/UserRepository";
import { generateHash } from "@/utils/crypt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      return handleGet(Number(id), req, res);
    case "PUT":
      return handlePost(Number(id), req, res);
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
  return UserRepository.findById(Number(id))
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "No users found." });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch(() => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
}

async function handlePost(
  id: number,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, email, gender, birthdate } = req.body;

    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.email !== email) {
      const emailAlreadyRegistered = await UserRepository.findByEmail(email);
      if (emailAlreadyRegistered) {
        return res.status(400).json({ message: "Email already registered." });
      }
    }

    const profileData = {
      name: username,
      birth_date: new Date(birthdate),
      gender: gender,
    };
    const authIdHash = await generateHash(email);
    const authorizationData = {
      auth_id: authIdHash,
      password_hash: existingUser.password_hash,
    };
    const contactData = {
      email: email,
    };
    const updatedUser = UserRepository.update(
      id,
      profileData,
      authorizationData,
      contactData
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save user." });
  }
}
