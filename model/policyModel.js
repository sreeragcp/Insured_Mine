import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true
    },
    policyStartDate: {
        type: Date,
        required: true
    },
    policyEndDate: {
        type: Date,
        required: true
    },
    policyCategory:{
        type: String,
        required: true
    },
    companyCollectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LOB'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Policy = mongoose.model('Policy', policySchema);

export default Policy;

