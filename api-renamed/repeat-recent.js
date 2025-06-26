import { repeatRecentRequests } from "../src/common/database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.send({ error: "Method Not Allowed" });
    return;
  }
  try {
    await repeatRecentRequests();
    res.statusCode = 200;
    res.send({ message: "Recent requests repeated successfully." });
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: error.message || "Internal Server Error" });
  }
};
