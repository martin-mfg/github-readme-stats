import { logger } from "../src/common/utils.js";
import { logout } from "../src/users.js";

/**
 * @param {any} req The request.
 * @param {any} res The response.
 */
export default async (req, res) => {
  const { user_key } = req.query;
  try {
    await logout(user_key);
  } catch (err) {
    logger.error(err);
    res.send("Something went wrong: " + err.message);
  }
  res.send("ok");
};
