import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
    const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } });
    console.log(`Mongo memory server started at ${mongod.getUri()}`);

    // Keep the process alive
    process.stdin.resume();

    process.on('SIGINT', async () => {
        await mongod.stop();
        process.exit();
    });
})();
