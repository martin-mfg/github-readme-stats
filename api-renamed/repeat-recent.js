import { repeatRecentRequests } from "../src/common/database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.send({ error: "Method Not Allowed" });
    return;
  }

  console.log("Repeating recent requests...");

  try {
    await repeatRecentRequests();
    res.statusCode = 200;
    res.send({ message: "Recent requests repeated successfully." });
  } catch (error) {
    console.error(
      "Error repeating recent requests:",
      error,
      JSON.stringify(error),
    );

    res.statusCode = 500;
    res.send({ error: error.message || "Internal Server Error" });
  }
};
