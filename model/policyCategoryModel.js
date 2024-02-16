import mongoose from "mongoose";

const lobSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    }
});

const Lob = mongoose.model('LOB', lobSchema);

export default Lob;

