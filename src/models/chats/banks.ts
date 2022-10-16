import { model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { USERS, BANKS } from '@/utils/constants';

const bankSchema: Schema = new Schema(
    {
        bankName: {
            type: String,
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
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

bankSchema.plugin(paginate);
const channelModel = model(BANKS, bankSchema);
export default channelModel;
