import { logger } from "../src/common/utils.js";
import { authenticate } from "../src/users.js";

/**
 * @param {any} req The request.
 * @param {any} res The response.
 */
export default async (req, res) => {
  const { code, private_access, user_key } = req.query;
  res.setHeader("Content-Type", "application/json");
  try {
    await authenticate(code, private_access === "true", user_key);
  } catch (err) {
    logger.error(err);
    res.send("Something went wrong: " + err.message);
  }
  res.send("ok");
};
