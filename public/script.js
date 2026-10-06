const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get selected rating
    const selectedRating = document.querySelector(
        'input[name="rating"]:checked'
    );

    if (!selectedRating) {
        message.textContent = "Please select a rating!";
        message.style.color = "red";
        return;
    }

    // Collect form data
    const feedbackData = {
        studentName: document.getElementById("studentName").value,
        registerNo: document.getElementById("registerNo").value,
        department: document.getElementById("department").value,
        course: document.getElementById("course").value,
        faculty: document.getElementById("faculty").value,
        rating: Number(selectedRating.value),
        comments: document.getElementById("comments").value
    };

    try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });

        const result = await response.json();

        if (response.ok) {
            message.textContent = "Feedback submitted successfully!";
            message.style.color = "green";

            // Clear the form
            form.reset();

        } else {
            message.textContent =
                result.message || "Failed to submit feedback!";
            message.style.color = "red";
        }

    } catch (error) {
        console.error(error);

        message.textContent =
            "Server error. Please try again.";
        message.style.color = "red";
    }
});