import axios from "axios";
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
  if (req.headers && req.headers["x-bypass-store"]) {
    return;
  }

  const insertQuery = `
      INSERT INTO requests (request, requested_at)
      VALUES ($1, NOW())
      ON CONFLICT (request)
      DO UPDATE SET requested_at = EXCLUDED.requested_at
    `;

  try {
    await pool.query(insertQuery, [req.url]);
  } catch (err) {
    // Check for undefined_table error (SQLSTATE 42P01)
    if (err.code === "42P01") {
      const createTableQuery = `
          CREATE TABLE IF NOT EXISTS requests (
            request TEXT PRIMARY KEY,
            requested_at TIMESTAMP NOT NULL DEFAULT now()
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
 * Deletes all requests older than 7 days from the database.
 */
async function deleteOldRequests() {
  if (!pool) {
    return;
  }

  const deleteQuery = `
      DELETE FROM requests
      WHERE requested_at < NOW() - INTERVAL '7 days'
    `;
  const result = await pool.query(deleteQuery);
  console.log(`Deleted ${result.rowCount} old requests.`);
}

/**
 * Fetches all requests from the last 7 days.
 * @returns {Promise<string[]>} An array of requests made in the last 7 days.
 */
async function getRecentRequests() {
  if (!pool) {
    return [];
  }

  const query = `
      SELECT request
      FROM requests
      WHERE requested_at >= NOW() - INTERVAL '7 days'
        AND requested_at < NOW() - INTERVAL '1 hour';
      `;
  const { rows } = await pool.query(query);
  return rows.map((row) => row.request);
}

/**
 * Processes URLs with a thread pool of given size using axios.get.
 * @param {string[]} urls An array of URLs to process.
 * @param {number} poolSize The number of concurrent requests to process.
 * @returns {Promise<void>} A promise that resolves when all requests are processed.
 */
async function makeRequests(urls, poolSize) {
  let current = 0;

  /**
   * Worker function to process `urls`.
   */
  async function worker() {
    while (true) {
      let idx = current++;
      if (idx >= urls.length) {
        break;
      }
      const url = "https://" + process.env.VERCEL_BRANCH_URL + urls[idx];
      try {
        if (idx % 10 === 0) {
          console.log(`Processing request ${idx + 1} out of ${urls.length}`);
        }
        await axios.get(url, {
          timeout: 10000,
          headers: { "x-bypass-store": "true" },
        });
      } catch (err) {
        console.error(`Error fetching ${url}:`, err.message);
      }
    }
  }

  const workers = [];
  for (let i = 0; i < poolSize; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
}

/**
 * Repeats requests made in the last 7 days, excluding those made in the last hour.
 */
export async function repeatRecentRequests() {
  if (!pool) {
    console.error("Postgres pool is not initialized.");
    return;
  }

  await deleteOldRequests();
  const urls = await getRecentRequests();
  if (urls.length === 0) {
    console.log("No recent requests found.");
  } else {
    await makeRequests(urls, 5);
  }
}
