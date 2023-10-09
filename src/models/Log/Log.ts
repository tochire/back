import * as Mongoose from "mongoose";

export interface Log extends Mongoose.Document {
  id: string;
  shopId : string;
  loggerId : string;
  time : number;
  action : string;

}

const LogSchema = new Mongoose.Schema({
    shopId : String,
    loggerId : String,
    time : Number,
    action : String,
});

export const Log = Mongoose.model<Log>("log", LogSchema);