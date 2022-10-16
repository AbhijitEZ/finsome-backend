import { model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { USERS, CHANNELS } from '@/utils/constants';

const timeDurationArray: Schema = new Schema({
    duration: {
        type: String,
        enum: ["1 Month", "3 Months", "6 Months", "1 Year"]
    },
    amount: { type: Number }
}, { _id: false });


const userArray: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: ["Admin", "SubAdmin", "Normal"],
        default: "Admin"
    }
}, { _id: false });


const channelSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        channelImage: {
            type: String,
            default: ""
        },
        users: [userArray],
        subscriptions: [timeDurationArray],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: USERS,
            required: true
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

channelSchema.plugin(paginate);
const channelModel = model(CHANNELS, channelSchema);
export default channelModel;
