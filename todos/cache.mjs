import fs from "fs";

export class CacheResponse {
  constructor(cacheKey, ttl) {
    this.cacheKey = `/tmp/${cacheKey}`;
    this.cacheMetaKey = `/tmp/${cacheKey}.meta`;
    this.ttl = ttl;
  }

  read(now) {
    try {
      const metaRaw = fs.readFileSync(this.cacheMetaKey, "utf8");
      const meta = JSON.parse(metaRaw);

      if (now - meta.timestamp > this.ttl) {
        return null;
      }
      const todosRaw = fs.readFileSync(this.cacheKey, "utf8");
      if (todosRaw) {
        const todos = JSON.parse(todosRaw);
        const expiry = new Date(meta.timestamp + this.ttl).toISOString();

        return {
          data: todos,
          expiry: expiry,
        };
      }
    } catch (err) {
      console.log("Error reading from cache", err);
    }
    return null;
  }

  write(data) {
    const meta = {
      timestamp: Date.now(),
    };
    fs.writeFileSync(this.cacheMetaKey, JSON.stringify(meta));
    fs.writeFileSync(this.cacheKey, JSON.stringify(data));
    return {
      expiry: new Date(meta.timestamp + this.ttl).toISOString(),
    };
  }
}
