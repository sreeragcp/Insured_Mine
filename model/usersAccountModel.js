import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

export default Account;

