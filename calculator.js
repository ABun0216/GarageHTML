window.addEventListener("DOMContentLoaded", () => {
    const minorRepair = document.getElementById("minorRepair");
    const majorRepair = document.getElementById("majorRepair");

    minorRepair.addEventListener("change", function () {
      if (this.checked) {
        majorRepair.checked = false;
      }
    });

    majorRepair.addEventListener("change", function () {
      if (this.checked) {
        minorRepair.checked = false;
      }
    });
  });
  const servicePrices = {
    "SUV": {
      "Minor Repair": 450,
      "Major Repair": 1200,
      "General Service": 200,
      "Health Check": 100
    },
    "Minibus": {
      "Minor Repair": 550,
      "Major Repair": 1500,
      "General Service": 350,
      "Health Check": 150
    },
    "Convertible": {
      "Minor Repair": 100,
      "Major Repair": 800,
      "General Service": 150,
      "Health Check": 50
    },
    "Other": {
      "Minor Repair": 200,
      "Major Repair": 1000,
      "General Service": 150,
      "Health Check": 70
    }
  };

  document.getElementById("calculatorForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const vehicleType = document.getElementById("vehicleType").value;
    const serviceCheckboxes = document.querySelectorAll("input[type=checkbox]:checked");
    const motExpiryDate = document.getElementById("motExpiry").value;
    const appointmentDate = document.getElementById("appointmentDate").value;

    let baseTotal = 0;
    let motCharge = 0;
    let motIncluded = false;

    // Check for MOT first
    serviceCheckboxes.forEach(cb => {
      if (cb.value === "MOT") {
        motIncluded = true;

        if (!motExpiryDate) {
          alert("Please provide the MOT expiry date.");
          return;
        }

        const expiry = new Date(motExpiryDate);
        const appointment = new Date(appointmentDate);
        const diffDays = Math.ceil((expiry - appointment) / (1000 * 60 * 60 * 24));

        if (diffDays < -0.5) {
          // After expiry
          motCharge = 40 * 1.3;
        } else if (diffDays <= 7 && diffDays >= 0) {
          // Within 7 days before expiry
          motCharge = 40;
        } else {
          alert("MOT service can only be booked within 7 days before expiry or after expiry.");
          return;
        }
      }
    });

    // Add MOT charge if included
    baseTotal += motCharge;

    // Add other services
    serviceCheckboxes.forEach(cb => {
      if (cb.value !== "MOT") {
        baseTotal += servicePrices[vehicleType][cb.value];
      }
    });

    // Check for Saturday
    const appointmentDay = new Date(appointmentDate).getDay(); // 0=Sun, 6=Sat
    let saturdayFee = 0;
    if (appointmentDay === 6) {
      saturdayFee = baseTotal * 0.5 + 50;
    }

    const totalBeforeVAT = baseTotal + saturdayFee;
    const VAT = totalBeforeVAT * 0.2;
    const totalWithVAT = totalBeforeVAT + VAT;

    // Display result
    document.getElementById("result").innerHTML = `
      <p><strong>Subtotal (no VAT):</strong> £${totalBeforeVAT.toFixed(2)}</p>
      <p><strong>VAT (20%):</strong> £${VAT.toFixed(2)}</p>
      <p><strong>Total to Pay:</strong> £${totalWithVAT.toFixed(2)}</p>
    `;
  });
