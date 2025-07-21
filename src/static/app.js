document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        // Activity name as blue link-style heading (not a real link)
        const title = document.createElement("h4");
        title.textContent = name;
        title.style.color = "#1565c0";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "8px";
        activityCard.appendChild(title);

        // Description
        const desc = document.createElement("p");
        desc.textContent = details.description;
        desc.style.marginBottom = "14px";
        activityCard.appendChild(desc);

        // Schedule
        const sched = document.createElement("p");
        sched.innerHTML = `<strong>Schedule:</strong> ${details.schedule}`;
        activityCard.appendChild(sched);

        // Availability (spots left)
        const spotsLeft = details.max_participants - (details.participants ? details.participants.length : 0);
        const avail = document.createElement("p");
        avail.innerHTML = `<strong>Availability:</strong> ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`;
        activityCard.appendChild(avail);

        // Participants section (pretty)
        const participantsSection = document.createElement("div");
        participantsSection.style.marginTop = "10px";
        participantsSection.style.background = "#eef4fb";
        participantsSection.style.borderRadius = "4px";
        participantsSection.style.padding = "8px 12px";

        const participantsTitle = document.createElement("span");
        participantsTitle.innerHTML = "<strong>Participants:</strong>";
        participantsSection.appendChild(participantsTitle);

        const ul = document.createElement("ul");
        ul.style.margin = "8px 0 0 18px";
        ul.style.padding = "0";
        if (details.participants && details.participants.length > 0) {
          details.participants.forEach(email => {
            const li = document.createElement("li");
            li.textContent = email;
            li.style.fontSize = "0.97em";
            ul.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.textContent = "None yet";
          li.style.fontStyle = "italic";
          ul.appendChild(li);
        }
        participantsSection.appendChild(ul);

        activityCard.appendChild(participantsSection);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
