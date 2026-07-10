import openNextWorker from "./.open-next/worker.js";

export * from "./.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    for (const [key, value] of Object.entries(env)) {
      if (typeof value === "string") {
        process.env[key] = value;
      }
    }

    return openNextWorker.fetch(request, env, ctx);
  },
};
