import { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "../../../repositories/UserRepository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      return UserRepository.findById(Number(id))
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
    case "PUT":
      try {
        const { username, email, gender, birthdate } = req.body;
        const profileData = {
          name: username,
          gender: gender,
          birth_date: new Date(birthdate),
        };
        const contactData = {
          email: email,
        };
        const updatedUser = UserRepository.update(Number(id), {
          profile: profileData,
          contact: contactData,
        });
        return res.status(200).json(updatedUser);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to save user." });
      }
    case "DELETE":
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
