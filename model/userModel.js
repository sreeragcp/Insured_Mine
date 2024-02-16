import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    dob: Date,
    address: String,
    phone: String,
    state: String,
    zip: String,
    email: String,
    gender: String,
    userType: String,
    agentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    accountId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account' 
    }
});

const User = mongoose.model('User', userSchema);

export default User;

