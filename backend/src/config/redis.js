const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'savory-ebullient-scale-73460.db.redis.io',
        port: 14844,
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error("Redis reconnection failed after 10 attempts.");
                return new Error("Redis connection exhausted");
            }
            return Math.min(retries * 200, 3000);
        }
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Handled Error:', err.message);
});

redisClient.on('reconnecting', () => {
    console.log('Redis client reconnecting to cluster...');
});

redisClient.on('connect', () => {
    console.log('Redis client connected.');
});

module.exports = redisClient;
