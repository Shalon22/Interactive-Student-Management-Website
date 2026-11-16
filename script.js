/* =========================================================
   1. Initial Student Data (Array of Objects)
   ========================================================= */
let students = [
  {
    id: 1,
    name: "Ann Njoki",
    age: 25,
    gender: "Female",
    course: "Video Editing",
    marks: 50
  },
  {
    id: 2,
    name: "Catherine Wanjiru",
    age: 27,
    gender: "Female",
    course: "Broadcast",
    marks: 70
  }
];

let nextStudentId = 3;

/* =========================================================
   2. Helper Functions (Performance Grading & Feedback)
   ========================================================= */
function getPerformanceDetails(marks) {
  if (marks >= 80 && marks <= 100) {
    return { label: "Excellent", className: "perf-excellent" };
  } else if (marks >= 70) {
    return { label: "Very Good", className: "perf-very-good" };
  } else if (marks >= 60) {
    return { label: "Good", className: "perf-good" };
  } else if (marks >= 50) {
    return { label: "Average", className: "perf-average" };
  } else {
    return { label: "Failed", className: "perf-failed" };
  }
}

function showFeedback(element, message, isError) {
  element.textContent = message;
  element.className = isError
    ? "feedback-msg feedback-error"
    : "feedback-msg feedback-success";
}

/* =========================================================
   3. Mobile Navigation Toggle (Shared Across All Pages)
   ========================================================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });
}

/* =========================================================
   4. Dashboard & Student Management Logic (index.html)
   ========================================================= */
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

if (studentForm && studentTableBody) {
  const formMessage = document.getElementById("formMessage");
  const searchInput = document.getElementById("searchInput");
  const courseFilter = document.getElementById("courseFilter");
  const sortMarksBtn = document.getElementById("sortMarksBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const noRecordsMessage = document.getElementById("noRecordsMessage");

  // Update Dashboard Statistics & Highest/Lowest Summary
  function updateDashboardStats() {
    const totalEl = document.getElementById("totalStudents");
    const passedEl = document.getElementById("passedStudents");
    const failedEl = document.getElementById("failedStudents");
    const averageEl = document.getElementById("averageMarks");
    const highestEl = document.getElementById("highestStudent");
    const lowestEl = document.getElementById("lowestStudent");

    const total = students.length;
    totalEl.textContent = total;

    if (total === 0) {
      passedEl.textContent = "0";
      failedEl.textContent = "0";
      averageEl.textContent = "0%";
      highestEl.textContent = "N/A";
      lowestEl.textContent = "N/A";
      return;
    }

    let passedCount = 0;
    let failedCount = 0;
    let sumMarks = 0;
    let highestStudent = students[0];
    let lowestStudent = students[0];

    // Loop through student records[cite: 7]
    for (let i = 0; i < students.length; i++) {
      const current = students[i];
      sumMarks += current.marks;

      if (current.marks >= 50) {
        passedCount++;
      } else {
        failedCount++;
      }

      if (current.marks > highestStudent.marks) {
        highestStudent = current;
      }
      if (current.marks < lowestStudent.marks) {
        lowestStudent = current;
      }
    }

    const average = (sumMarks / total).toFixed(1);

    passedEl.textContent = passedCount;
    failedEl.textContent = failedCount;
    averageEl.textContent = average + "%";
    highestEl.textContent = `${highestStudent.name} (${highestStudent.marks}%)`;
    lowestEl.textContent = `${lowestStudent.name} (${lowestStudent.marks}%)`;
  }

  // Render Student Records Table (with Search & Course Filter)
  function renderStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(function (student) {
      const matchesName = student.name.toLowerCase().includes(searchTerm);
      const matchesCourse = selectedCourse === "All" || student.course === selectedCourse;
      return matchesName && matchesCourse;
    });

    studentTableBody.innerHTML = "";

    if (filteredStudents.length === 0) {
      noRecordsMessage.classList.remove("hidden");
    } else {
      noRecordsMessage.classList.add("hidden");

      for (let i = 0; i < filteredStudents.length; i++) {
        const student = filteredStudents[i];
        const performance = getPerformanceDetails(student.marks);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><strong>${student.name}</strong></td>
          <td>${student.age}</td>
          <td>${student.gender}</td>
          <td>${student.course}</td>
          <td>${student.marks}%</td>
          <td><span class="badge ${performance.className}">${performance.label}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-secondary btn-sm" onclick="updateStudentMarks(${student.id})">Edit Marks</button>
              <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
          </td>
        `;
        studentTableBody.appendChild(row);
      }
    }

    updateDashboardStats();
  }

  // Register New Student Form Submission & Validation[cite: 2, 3]
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const ageValue = document.getElementById("studentAge").value.trim();
    const gender = document.getElementById("studentGender").value;
    const course = document.getElementById("studentCourse").value;
    const marksValue = document.getElementById("studentMarks").value.trim();

    const age = Number(ageValue);
    const marks = Number(marksValue);

    if (!name || !ageValue || !gender || !course || marksValue === "") {
      showFeedback(formMessage, "Error: Please fill in all required fields.", true);
      return;
    }

    if (isNaN(age) || age < 15 || age > 100) {
      showFeedback(formMessage, "Error: Please enter a valid age between 15 and 100.", true);
      return;
    }

    if (isNaN(marks) || marks < 0 || marks > 100) {
      showFeedback(formMessage, "Error: Marks must be a number between 0 and 100.", true);
      return;
    }

    const newStudent = {
      id: nextStudentId++,
      name: name,
      age: age,
      gender: gender,
      course: course,
      marks: marks
    };

    students.push(newStudent);
    studentForm.reset();
    showFeedback(formMessage, `Success! ${name} has been registered.`, false);
    renderStudents();
  });

  // Update Marks Function
  window.updateStudentMarks = function (studentId) {
    const student = students.find(function (s) {
      return s.id === studentId;
    });

    if (!student) return;

    const input = prompt(`Enter new marks (0 - 100) for ${student.name}:`, student.marks);
    if (input === null) return;

    const newMarks = Number(input.trim());
    if (input.trim() === "" || isNaN(newMarks) || newMarks < 0 || newMarks > 100) {
      alert("Invalid marks! Please enter a number between 0 and 100.");
      return;
    }

    student.marks = newMarks;
    renderStudents();
  };

  // Delete Student Function[cite: 3, 4]
  window.deleteStudent = function (studentId) {
    const student = students.find(function (s) {
      return s.id === studentId;
    });

    if (!student) return;

    const confirmed = confirm(`Are you sure you want to delete ${student.name}'s record?`);
    if (confirmed) {
      students = students.filter(function (s) {
        return s.id !== studentId;
      });
      renderStudents();
    }
  };

  // Search & Filter Event Listeners[cite: 3, 5]
  searchInput.addEventListener("input", renderStudents);
  courseFilter.addEventListener("change", renderStudents);

  // Bonus: Sort by Marks (Highest to Lowest)[cite: 9]
  sortMarksBtn.addEventListener("click", function () {
    students.sort(function (a, b) {
      return b.marks - a.marks;
    });
    renderStudents();
  });

  // Bonus: Clear All Students[cite: 9]
  clearAllBtn.addEventListener("click", function () {
    if (students.length === 0) return;
    if (confirm("Are you sure you want to clear all registered students?")) {
      students = [];
      renderStudents();
    }
  });

  renderStudents();
}

/* =========================================================
   5. Contact Form Validation (contact.html)
   ========================================================= */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const contactFeedback = document.getElementById("contactFeedback");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!fullName || !email || !subject || !message) {
      showFeedback(contactFeedback, "Error: All fields are required.", true);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showFeedback(contactFeedback, "Error: Please enter a valid email address containing '@' and a dot.", true);
      return;
    }

    if (message.length < 10) {
      showFeedback(contactFeedback, "Error: Your message must be at least 10 characters long.", true);
      return;
    }

    showFeedback(contactFeedback, "Thank you, your message has been sent!", false);
    contactForm.reset();
  });
}
