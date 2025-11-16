import mongoose from 'mongoose';
import type { ITodo } from '../types.js';
declare const _default: mongoose.Model<ITodo, {}, {}, {}, mongoose.Document<unknown, {}, ITodo, {}, {}> & ITodo & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
