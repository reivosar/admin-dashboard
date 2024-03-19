import type { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "../../../repositories/UserRepository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
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
          console.error(error);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    case "POST":
      try {
        const { username, email, password, gender, birthdate } = req.body;
        const profileData = {
          name: username,
          gender: gender,
          birth_date: new Date(birthdate),
        };
        const authorizationData = {
          auth_id: email,
          password_hash: password,
        };
        const contactData = {
          email: email,
        };
        const savedUser = UserRepository.save({
          profile: profileData,
          authorization: authorizationData,
          contacts: contactData,
        });
        return res.status(201).json(savedUser);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to save user." });
      }
    case "PUT":
      res
        .status(200)
        .json({ message: "PUT request to /api/user", body: req.body });
      break;
    case "DELETE":
      const userIds = req.body.userIds;
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "Invalid request data." });
      }
      return UserRepository.delete(userIds)
        .then(() => {
          return res
            .status(200)
            .json({ message: "Users successfully deleted." });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
