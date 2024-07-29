document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("medFreqUnit");
  const container = document.getElementById("recurring__form");
  const time = document.getElementById('date');


  time.min = new Date().toISOString().split("T")[0];
  let newElement = null;

  selectElement.addEventListener("change", () => {
    window.scroll({
      top:650,
      bottom:450,
      behavior:"smooth"
    })
    

    if (newElement!=null){
      container.removeChild(newElement);
      newElement = null;
    }
    
    if (selectElement.value === "weekly") {
      newElement = document.createElement("div");
      newElement.id = "weeklyDiv"
      newElement.innerHTML = `<label for="medDay">Select Day:</label>
            <select name="weekDay" id="weeklyDeliverDay" required>
                <option disabled selected value> --select-- </option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
            </select><br>
            <h2>Select Start Date and End Date</h2>
                <label for="medName">Start Date:</label>
                    <input type="date" name="startDate" id="startDate" min=${new Date().toISOString().split("T")[0]} required/>
                <label for="medName">End Date:</label>
                    <input type="date" name="endDate" id="endDate" required/>
                <label for="medName">Notification Time:</label>
                    <input type="time" name="medicTime" id="recurMedTime" required/>
            <input type="submit" value="Set Medicine Remainder" name="submit"/>
            `;
      container.appendChild(newElement);

    const startDateInput = newElement.querySelector('#startDate');
    const endDateInput = newElement.querySelector('#endDate');

    startDateInput.addEventListener('change', function() {
        let startDate = new Date(startDateInput.value);
        startDate.setDate(startDate.getDate()+7);
        endDateInput.min = startDate.toISOString().split("T")[0];
    });

    } else if (selectElement.value === "daily") {
      newElement = document.createElement("div");
      newElement.innerHTML = `<br>
      <h2>Select Start Date and End Date</h2>
      <label for="medName">Start Date:</label>
      <input type="date" name="startDate" id="startDate" min=${new Date().toISOString().split("T")[0]} required/>
      <label for="medName">End Date:</label>
      <input type="date" name="endDate" id="endDate" required/>
      <label for="medName">Notification Time:</label>
      <input type="time" name="medicTime" id="recurMedTime" required/>
      <input type="submit" value="Set Medicine Remainder" name="submit"/>
      `;
      container.appendChild(newElement);

    const startDateInput = newElement.querySelector('#startDate');
    const endDateInput = newElement.querySelector('#endDate');

        startDateInput.addEventListener('change', function() {
        let startDate = new Date(startDateInput.value);
        startDate.setDate(startDate.getDate()+1);
        endDateInput.min = startDate.toISOString().split("T")[0];
      })
    }
  });
});

async function userLogOut() {
  try {
    const response = await fetch("/logout");
    if (response.ok) {
      window.location.href = `/login`;
    } else {
      document.getElementById('errorMessage').textContent = response.statusText;
      $('#errorModal').modal('show');
    }
  } catch (err) {
    console.error("Error:", err);
    $('#errorModal').modal('show');
  }
}

function toggleOneTimeForm() {
  const form = document.getElementById("one__time__form");
  const recurForm = document.getElementById("recurring__form");
  if (!recurForm.hidden) {
    recurForm.hidden = !recurForm.hidden;
  }
  form.hidden = !form.hidden;
  form.reset();
  window.scroll({
    top:300,
    bottom:250,
    behavior:"smooth"
  })
}

function toggleRecurForm() {
  const form = document.getElementById("recurring__form");
  const oneTimeForm = document.getElementById("one__time__form");
  if (!oneTimeForm.hidden) {
    oneTimeForm.hidden = !oneTimeForm.hidden;
  }
  
  form.hidden = !form.hidden;
  form.reset();
  window.scroll({
    top:250,
    bottom:250,
    behavior:"smooth"
  })
}

document
  .getElementById("one__time__form")
  .addEventListener("submit", setOneTimeMedic);

async function setOneTimeMedic(event) {
  event.preventDefault();

  const form = document.getElementById("one__time__form");
  const medName = document.getElementById("medName").value;
  const medDesc = document.getElementById("medDesc").value;
  const time = document.getElementById("time").value;
  const date = document.getElementById("date").value;

  try {
    const response = await fetch("/oneTimeJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medName, medDesc, time, date }),
    });

    if (response.ok) {
      const message = `Your schedule for ${medName} has been set for ${date} at ${time}`;
      document.getElementById('notificationMessage').textContent = message;
      $('#notificationModal').modal('show');
      form.reset();
    } else {
      $('#errorModal').modal('show');
      form.reset();
      form.hidden = true;
    }
  } catch (err) {
    if (err) {
      console.error("Error:", err);
    }
  }
}

document
  .getElementById("recurring__form")
  .addEventListener("submit", setRecurMedic);

async function setRecurMedic(event) {
  event.preventDefault();

  const form = document.getElementById("recurring__form");
  const medFreq = document.getElementById("medFreqUnit").value;

  try {
    if (medFreq == "daily") {
      const medName = document.getElementById("recurMedName").value;
      const medDesc = document.getElementById("recurMedDesc").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const time = document.getElementById("recurMedTime").value;
      const response = await fetch("/recurJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medName,
          medDesc,
          medFreq,
          startDate,
          endDate,
          time,
        }),
      });

      if (response.ok) {
        const message = `${medName} notification has been set from ${startDate} everyday on ${time} till ${endDate}`;
    
        document.getElementById('notificationMessage').textContent = message;
        $('#notificationModal').modal('show');

        form.reset();
        form.hidden = true;
      } else {
        $('#errorModal').modal('show');
        form.reset();
        form.hidden = true;
      }
    } else if (medFreq == "weekly") {
      const medName = document.getElementById("recurMedName").value;
      const medDesc = document.getElementById("recurMedDesc").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const time = document.getElementById("recurMedTime").value;
      const day = document.getElementById("weeklyDeliverDay")?.value;

      const response = await fetch("/recurJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medName,
          medDesc,
          medFreq,
          startDate,
          endDate,
          time,
          day,
        }),
      });

      if (response.ok) {
        const message = `${medName} notification has been set from ${startDate} to ${endDate} at ${time}`;
        form.reset();
        form.hidden=true;

        document.getElementById('notificationMessage').textContent = message;
        $('#notificationModal').modal('show');
      } else {
        $('#errorModal').modal('show');
        form.reset();
        form.hidden = true;
      }
    }
  } catch (err) {
    if (err) {
      console.error("Error:", err);
    }
  }
}