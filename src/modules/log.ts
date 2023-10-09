import { Log } from "../models/Log/Log";

export const logAction = async (
  loggerId: string,
  shopId: string,
  action: string,
  time: number
) => {
  const log = new Log({ loggerId, shopId, action, time });
  await log.save();
};
