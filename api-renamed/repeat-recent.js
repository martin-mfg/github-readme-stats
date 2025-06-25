import { repeatRecentRequests } from "../src/common/database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    await repeatRecentRequests();
    res.status(200).json({ message: "Recent requests repeated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
