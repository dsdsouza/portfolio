/** @type {ExportedHandler<Env>} */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
