// ==================================================
// Load Feedback
// ==================================================

async function loadFeedback() {

    try {

        const registerNo =
            document.getElementById("registerSearch").value.trim();

        const course =
            document.getElementById("courseFilter").value.trim();

        let url = "/api/feedback";

        const params = new URLSearchParams();

        if (registerNo) {
            params.append("registerNo", registerNo);
        }

        if (course) {
            params.append("course", course);
        }

        if (params.toString()) {
            url += "?" + params.toString();
        }


        const response = await fetch(url);

        const feedback = await response.json();

        displayFeedback(feedback);

        updateStatistics(feedback);

    } catch (error) {

        console.error(error);

        document.getElementById("feedbackTableBody").innerHTML =
            `<tr>
                <td colspan="8">
                    Failed to load feedback
                </td>
            </tr>`;
    }
}


// ==================================================
// Display Feedback in Table
// ==================================================

function displayFeedback(feedback) {

    const tableBody =
        document.getElementById("feedbackTableBody");

    tableBody.innerHTML = "";


    if (feedback.length === 0) {

        tableBody.innerHTML =
            `<tr>
                <td colspan="8">
                    No feedback found
                </td>
            </tr>`;

        return;
    }


    feedback.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.studentName}</td>

            <td>${item.registerNo}</td>

            <td>${item.department}</td>

            <td>${item.course}</td>

            <td>${item.faculty}</td>

            <td>${"⭐".repeat(item.rating)}</td>

            <td>${item.comments}</td>

            <td>
                <button
                    class="delete-button"
                    onclick="deleteFeedback('${item._id}')">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ==================================================
// Statistics
// ==================================================

function updateStatistics(feedback) {

    const total =
        document.getElementById("totalFeedback");

    const average =
        document.getElementById("overallAverage");


    total.textContent = feedback.length;


    if (feedback.length === 0) {

        average.textContent = "0.00 ⭐";

        return;
    }


    const totalRating =
        feedback.reduce(
            (sum, item) => sum + item.rating,
            0
        );


    const avg =
        totalRating / feedback.length;


    average.textContent =
        avg.toFixed(2) + " ⭐";
}


// ==================================================
// Delete Feedback
// ==================================================

async function deleteFeedback(id) {

    const confirmation =
        confirm("Are you sure you want to delete this feedback?");

    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(`/api/feedback/${id}`, {
                method: "DELETE"
            });


        const result =
            await response.json();


        if (response.ok) {

            alert("Feedback deleted successfully!");

            loadFeedback();

        } else {

            alert(
                result.message ||
                "Failed to delete feedback"
            );
        }

    } catch (error) {

        console.error(error);

        alert("Server error while deleting feedback.");
    }
}


// ==================================================
// Clear Filters
// ==================================================

function clearFilters() {

    document.getElementById("registerSearch").value = "";

    document.getElementById("courseFilter").value = "";

    loadFeedback();
}


// ==================================================
// Faculty Average
// ==================================================

async function getFacultyAverage() {

    const faculty =
        document.getElementById("facultySearch")
        .value
        .trim();


    const resultElement =
        document.getElementById("facultyResult");


    if (!faculty) {

        resultElement.textContent =
            "Please enter a faculty name.";

        resultElement.style.color = "red";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/feedback/average?faculty=${encodeURIComponent(faculty)}`
            );


        const result =
            await response.json();


        if (response.ok) {

            resultElement.textContent =
                `${result.faculty} - Average Rating: ${result.averageRating} ⭐`;

            resultElement.style.color = "green";

        } else {

            resultElement.textContent =
                result.message;

            resultElement.style.color = "red";
        }

    } catch (error) {

        console.error(error);

        resultElement.textContent =
            "Failed to calculate average.";

        resultElement.style.color = "red";
    }
}


// ==================================================
// Load Feedback When Page Opens
// ==================================================

window.addEventListener("load", loadFeedback);