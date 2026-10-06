const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true
        },

        registerNo: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        course: {
            type: String,
            required: true
        },

        faculty: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comments: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;