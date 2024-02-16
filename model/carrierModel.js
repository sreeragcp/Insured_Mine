import mongoose from "mongoose";

const carrierSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    }
});

const Carrier = mongoose.model('Carrier', carrierSchema);

export default Carrier;

