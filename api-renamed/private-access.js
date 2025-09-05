import { logger } from "../src/common/utils.js";
import { hasPrivateAccess } from "../src/common/database.js";

/**
 * @param {any} req The request.
 * @param {any} res The response.
 */
export default async (req, res) => {
  const { user_key } = req.query;
  try {
    const result = await hasPrivateAccess(user_key);
    res.send(result);
  } catch (err) {
    logger.error(err);
    res.send("Something went wrong: " + err.message);
  }
};

