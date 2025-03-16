document.addEventListener("DOMContentLoaded", () => {
    const toggleFeedbackButton = document.getElementById("feedback-toggle");
    const feedbackForm = document.getElementById("feedbackForm");

    toggleFeedbackButton.addEventListener("click", () => {
        feedbackForm.style.display = feedbackForm.style.display == "block" ? "none" : "block";
    })
});