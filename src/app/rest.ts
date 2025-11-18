import server from "$server/instance";
import Logger from "$pkg/logger";
import { env } from "$utils/config.utils";

const startRestApp = () => {
  Logger.info("Starting App : rest");
  const app = server.restServer();
  const PORT: number = env.NODE_LOCAL_PORT;
  return app.listen(PORT, () => {
    Logger.info(`Rest App is Running at Port ${PORT}`);
  });
};

export default startRestApp;
