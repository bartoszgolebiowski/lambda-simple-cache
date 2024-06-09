import { CacheResponse } from "./cache.mjs";
import { JSONPlaceholderClient } from "./client.mjs";

const ONE_MINUTE = 1000 * 60;
const cache = new CacheResponse("todos", ONE_MINUTE);
const client = new JSONPlaceholderClient();

export const lambdaHandler = async () => {
  const todos = cache.read(Date.now());
  if (todos) {
    return {
      statusCode: 200,
      headers: {
        "X-Cache-Hit": "true",
        "X-Cache-Expiry": todos.expiry,
      },
      body: JSON.stringify({
        todos,
      }),
    };
  }
  try {
    const todos = await client.get();
    const cached = cache.write(todos);
    return {
      statusCode: 200,
      headers: {
        "X-Cache-Hit": "false",
        "X-Cache-Expiry": cached.expiry,
      },
      body: JSON.stringify({
        todos,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
