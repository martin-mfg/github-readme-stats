import pkg from "pg";
const { Pool } = pkg;

const pool = process.env.POSTGRES_URL
  ? new Pool({
      connectionString: process.env.POSTGRES_URL,
    })
  : null;

/**
 * Stores or updates a request in the database.
 */
export async function storeRequest(req) {
  if (!pool) {
    return;
  }

  const isBypass = req.headers && req.headers["x-bypass-store"];
  const insertQuery = isBypass
    ? `
        INSERT INTO requests (request, requested_at)
        VALUES ($1, NOW())
        ON CONFLICT (request)
        DO UPDATE SET requested_at = EXCLUDED.requested_at
      `
    : `
        INSERT INTO requests (request, requested_at, user_requested_at)
        VALUES ($1, NOW(), NOW())
        ON CONFLICT (request)
        DO UPDATE SET requested_at = EXCLUDED.requested_at, user_requested_at = EXCLUDED.user_requested_at
      `;

  try {
    await pool.query(insertQuery, [req.url]);
  } catch (err) {
    // Check for undefined_table error (SQLSTATE 42P01)
    if (err.code === "42P01") {
      const createTableQuery = `
          CREATE TABLE IF NOT EXISTS requests (
            request TEXT PRIMARY KEY,
            requested_at TIMESTAMP NOT NULL DEFAULT now(),
            user_requested_at TIMESTAMP NOT NULL DEFAULT now()
          )
        `;
      await pool.query(createTableQuery);
      // Retry the insert after creating the table
      await pool.query(insertQuery, [req.url]);
    } else {
      throw err; // Re-throw if it's some other error
    }
  }
}

/**
 * Deletes all requests older than 8 days from the database.
 */
export async function deleteOldRequests() {
  if (!pool) {
    return;
  }

  const deleteQuery = `
      DELETE FROM requests
      WHERE user_requested_at < NOW() - INTERVAL '8 days'
    `;
  const result = await pool.query(deleteQuery);
  console.log(`Deleted ${result.rowCount} old requests.`);
}

/**
 * Fetches all requests which are between 11 hours and 8 days old.
 * @returns {Promise<string[]>} Array of all requests between 11 hours and 8 days old.
 */
export async function getRecentRequests() {
  if (!pool) {
    return [];
  }

  const query = `
      SELECT request
      FROM requests
      WHERE requested_at >= NOW() - INTERVAL '8 days'
        AND requested_at < NOW() - INTERVAL '11 hours'
      ORDER BY requested_at ASC
      `;
  const { rows } = await pool.query(query);
  return rows.map((row) => row.request);
}
