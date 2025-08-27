const userTableBody = document.getElementById('userTableBody');
const generateBtn = document.getElementById('generateBtn');
const userCountInput = document.getElementById('userCount');
const nameSelect = document.getElementById('nameSelect');

// Modal elements
const modalPicture = document.getElementById('modalPicture');
const modalName = document.getElementById('modalName');
const modalAddress = document.getElementById('modalAddress');
const modalEmail = document.getElementById('modalEmail');
const modalPhone = document.getElementById('modalPhone');
const modalCell = document.getElementById('modalCell');
const modalDob = document.getElementById('modalDob');
const modalGender = document.getElementById('modalGender');

const deleteUserBtn = document.getElementById('deleteUserBtn');
const editUserBtn = document.getElementById('editUserBtn');

let currentUsers = [];
let selectedUserIndex = null;

// Fetch multiple users from API
async function getUsers(count) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    currentUsers = data.results;
    setUsersInfo(currentUsers);
  } catch (error) {
    console.error(error);
    alert("Error fetching users. Check your internet connection.");
  }
}

// Display users in table
function setUsersInfo(users) {
  userTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    let nameDisplay = nameSelect.value === "first" ? user.name.first : user.name.last;

    row.innerHTML = `
      <td>${nameDisplay}</td>
      <td>${user.gender}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.location.country}</td>
    `;

    // Double click → open modal
    row.addEventListener("dblclick", () => {
      selectedUserIndex = index;
      openModal(user);
    });

    userTableBody.appendChild(row);
  });
}

// Open modal and set details
function openModal(user) {
  modalPicture.src = user.picture.large;
  modalName.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;
  modalAddress.textContent = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`;
  modalEmail.textContent = user.email;
  modalPhone.textContent = user.phone;
  modalCell.textContent = user.cell;
  modalDob.textContent = new Date(user.dob.date).toLocaleDateString();
  modalGender.textContent = user.gender;

  $("#userModal").modal("show");
}

// Delete user
deleteUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    currentUsers.splice(selectedUserIndex, 1);
    setUsersInfo(currentUsers);
    $("#userModal").modal("hide");
  }
});

// Edit user
editUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    let user = currentUsers[selectedUserIndex];
    let newFirstName = prompt("Edit First Name:", user.name.first);
    let newLastName = prompt("Edit Last Name:", user.name.last);

    if (newFirstName) user.name.first = newFirstName;
    if (newLastName) user.name.last = newLastName;

    setUsersInfo(currentUsers);
    openModal(user); // refresh modal info
  }
});

// Event listener for generate
generateBtn.addEventListener("click", () => {
  const count = parseInt(userCountInput.value) || 0;

  if (count <= 0 || count > 1000) {
    alert("⚠️ Please enter a number between 1 and 1000.");
    return;
  }

  getUsers(count);
});

// Event listener for name select change
nameSelect.addEventListener("change", () => {
  if (currentUsers.length > 0) setUsersInfo(currentUsers);
});
