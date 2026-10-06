const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Use Google DNS for MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const Feedback = require("./models/Feedback");

const app = express();

const PORT = 5000;


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(express.json());

// Serve HTML, CSS and JavaScript from public folder
app.use(express.static(path.join(__dirname, "public")));


// ==================================================
// MONGODB CONNECTION
// ==================================================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    });


// ==================================================
// HOME PAGE
// ==================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ==================================================
// ADMIN PAGE
// ==================================================

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});


// ==================================================
// POST API - ADD FEEDBACK
// ==================================================

app.post("/api/feedback", async (req, res) => {

    try {

        const feedback = new Feedback(req.body);

        const savedFeedback = await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback: savedFeedback
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to submit feedback",
            error: error.message
        });

    }

});


// ==================================================
// GET API - GET / SEARCH / FILTER FEEDBACK
// ==================================================

app.get("/api/feedback", async (req, res) => {

    try {

        const { registerNo, course } = req.query;

        let filter = {};

        if (registerNo) {
            filter.registerNo = registerNo;
        }

        if (course) {
            filter.course = course;
        }

        const feedback = await Feedback
            .find(filter)
            .sort({ createdAt: -1 });

        res.json(feedback);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch feedback",
            error: error.message
        });

    }

});


// ==================================================
// GET API - FACULTY AVERAGE RATING
// ==================================================

app.get("/api/feedback/average", async (req, res) => {

    try {

        const { faculty } = req.query;

        if (!faculty) {

            return res.status(400).json({
                message: "Faculty name is required"
            });

        }

        const result = await Feedback.aggregate([

            {
                $match: {
                    faculty: faculty
                }
            },

            {
                $group: {
                    _id: "$faculty",
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }

        ]);

        if (result.length === 0) {

            return res.status(404).json({
                message: "No feedback found for this faculty"
            });

        }

        res.json({
            faculty: result[0]._id,
            averageRating: Number(
                result[0].averageRating.toFixed(2)
            )
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to calculate average rating",
            error: error.message
        });

    }

});


// ==================================================
// DELETE API - DELETE FEEDBACK
// ==================================================

app.delete("/api/feedback/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const deletedFeedback =
            await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {

            return res.status(404).json({
                message: "Feedback not found"
            });

        }

        res.json({
            message: "Feedback deleted successfully!",
            feedback: deletedFeedback
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete feedback",
            error: error.message
        });

    }

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});