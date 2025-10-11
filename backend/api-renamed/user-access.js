import { logger } from "../src/common/utils.js";
import { getUserAccess } from "../src/common/database.js";

/**
 * @param {any} req The request.
 * @param {any} res The response.
 */
export default async (req, res) => {
  const { user_key } = req.query;
  try {
    const result = await getUserAccess(user_key);

    if (!result) {
      res.statusCode = 404;
      res.send("user not found");
      return;
    }

    res.send({
      privateAccess: result.privateAccess,
      token: result.token
    });
  } catch (err) {
    logger.error(err);
    res.send("Something went wrong: " + err.message);
  }
};
