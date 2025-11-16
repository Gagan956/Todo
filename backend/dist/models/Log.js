import mongoose, { Schema } from 'mongoose';
const logSchema = new Schema({
    level: {
        type: String,
        enum: ['error', 'warn', 'info'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    stack: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
export default mongoose.model('Log', logSchema);
//# sourceMappingURL=Log.js.map