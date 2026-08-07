import { type FastifyPluginAsync } from "fastify";

export const auth: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/", async () => {
    return {
      message: "Hello User",
    };
  });
};
