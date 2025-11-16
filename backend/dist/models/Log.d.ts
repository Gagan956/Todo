import mongoose from 'mongoose';
import type { ILog } from '../types.js';
declare const _default: mongoose.Model<ILog, {}, {}, {}, mongoose.Document<unknown, {}, ILog, {}, {}> & ILog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
