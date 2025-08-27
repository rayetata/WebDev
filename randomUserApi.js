const userTableBody = document.getElementById('userTableBody');
const generateBtn = document.getElementById('generateBtn');
const userCountInput = document.getElementById('userCount');
const nameSelect = document.getElementById('nameSelect');

// Modal elements
const modal = document.getElementById('userModal');
const closeModal = document.getElementById('closeModal');
const modalPicture = document.getElementById('modalPicture');
const modalName = document.getElementById('modalName');
const modalAddress = document.getElementById('modalAddress');
const modalEmail = document.getElementById('modalEmail');

let currentUsers = [];

// Fetch multiple users from API
async function getUsers(count) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    currentUsers = data.results; // store for later use
    setUsersInfo(currentUsers);
  } catch (error) {
    console.error(error);
    alert("Error fetching users. Check your internet connection.");
  }
}

// Display users in table
function setUsersInfo(users) {
  userTableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    // pick name type
    let nameDisplay;
    if (nameSelect.value === "first") {
      nameDisplay = user.name.first;
    } else if (nameSelect.value === "last") {
      nameDisplay = user.name.last;
    }
    row.innerHTML = `
      <td>${nameDisplay}</td>
      <td>${user.gender}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.location.country}</td>
    `;

    // Double click → open modal
    row.addEventListener("dblclick", () => {
      modalPicture.src = user.picture.large;
      modalName.textContent = `${user.name.first} ${user.name.last}`;
      modalAddress.textContent = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`;
      modalEmail.textContent = user.email;
      modal.style.display = "flex";
    });

    userTableBody.appendChild(row);
  });
}

// Event listener for generate
generateBtn.addEventListener("click", () => {
  const count = parseInt(userCountInput.value) || 0;

  if (count <= 0) {
    alert("⚠️ Please enter at least 1 user.");
    return;
  }

  getUsers(count);
});

// Event listener for name select change
nameSelect.addEventListener("change", () => {
  if (currentUsers.length > 0) setUsersInfo(currentUsers);
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});
