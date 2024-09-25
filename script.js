const dayInput = document.querySelector(".day-input");
const monthInput = document.querySelector(".month-input");
const yearInput = document.querySelector(".year-input");

const dayLabel = document.querySelector(".day-label");
const monthLabel = document.querySelector(".month-label");
const yearLabel = document.querySelector(".year-label");

const dayError = document.querySelector(".day-error");
const monthError = document.querySelector(".month-error");
const yearError = document.querySelector(".year-error");

const calculateButton = document.querySelector(".circle");

// DRY: Single function to validate both the input field and its associated label/error
function handleValidation(
  inputElement,
  labelElement,
  errorElement,
  condition,
  errorMessage
) {
  if (condition) {
    errorElement.classList.remove("hidden");
    errorElement.textContent = errorMessage;
    inputElement.classList.add("input-error");
    labelElement.classList.add("label-error");
    return false;
  } else {
    errorElement.classList.add("hidden");
    inputElement.classList.remove("input-error");
    labelElement.classList.remove("label-error");
    return true;
  }
}

// Validate individual inputs
function validateInput(inputElement, labelElement, errorElement, type) {
  const value = inputElement.value.trim();

  // For empty input validation
  return handleValidation(
    inputElement,
    labelElement,
    errorElement,
    value === "",
    `Must enter a ${type}`
  );
}

// Function to check if the month has 30 days and the day is 31
function isInvalidDayForMonth(dayValue, monthValue) {
  // Months that have only 30 days
  const monthsWith30Days = [4, 6, 9, 11]; // April (04), June (06), September (09), November (11)

  return monthsWith30Days.includes(monthValue) && dayValue === 31;
}

// Validate date-specific fields (day, month, year)
function validateDateFields() {
  const dayValue = parseInt(dayInput.value);
  const monthValue = parseInt(monthInput.value);
  const yearValue = parseInt(yearInput.value);
  const currentYear = new Date().getFullYear();

  let isValid = true;

  // Validate day (1-31), including special cases for months with 30 days
  if (dayValue < 1 || dayValue > 31) {
    isValid = handleValidation(
      dayInput,
      dayLabel,
      dayError,
      true,
      "Must be a valid day"
    );
  } else if (isInvalidDayForMonth(dayValue, monthValue)) {
    // If month has 30 days but day is 31, show specific error for day only
    isValid = handleValidation(
      dayInput,
      dayLabel,
      dayError,
      true,
      "This month has only 30 days"
    );
  } else {
    hideError(dayInput, dayError);
  }

  // Validate month (1-12)
  isValid =
    handleValidation(
      monthInput,
      monthLabel,
      monthError,
      monthValue < 1 || monthValue > 12,
      "Must be a valid month"
    ) && isValid;

  // Validate year (past or current year)
  isValid =
    handleValidation(
      yearInput,
      yearLabel,
      yearError,
      yearValue > currentYear || yearValue < 1,
      "Must be in the past"
    ) && isValid;

  return isValid;
}

// Function to hide error message
function hideError(inputElement, errorElement) {
  inputElement.classList.remove("input-error");
  const labelElement = inputElement.previousElementSibling;
  labelElement.classList.remove("label-error");
  errorElement.classList.add("hidden");
}

// Attach the click event to the calculate button
calculateButton.addEventListener("click", function () {
  // Validate all inputs (day, month, year) for non-empty values
  const isDayValid = validateInput(dayInput, dayLabel, dayError, "Day");
  const isMonthValid = validateInput(
    monthInput,
    monthLabel,
    monthError,
    "Month"
  );
  const isYearValid = validateInput(yearInput, yearLabel, yearError, "Year");

  // Proceed if all inputs are valid and pass date-specific validation
  if (isDayValid && isMonthValid && isYearValid && validateDateFields()) {
    console.log("All inputs are valid.");
    // Further functionality for age calculation can go here
  }
});

/////////////////////////////////// CALCULATE THE AGE
// Get the span elements for displaying calculated age using their correct IDs
const yearsDisplay = document.getElementById("years");
const monthsDisplay = document.getElementById("months");
const daysDisplay = document.getElementById("days");

// Function to calculate the difference between two dates (input and current date)
function calculateAge(day, month, year) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed, so add 1
  const currentYear = currentDate.getFullYear();

  let calculatedDay = currentDay - day;
  let calculatedMonth = currentMonth - month;
  let calculatedYear = currentYear - year;

  // Adjust day and month if needed (e.g., if current day is less than the input day)
  if (calculatedDay < 0) {
    calculatedMonth--; // Borrow a month
    const daysInPreviousMonth = new Date(
      currentYear,
      currentMonth - 1,
      0
    ).getDate();
    calculatedDay += daysInPreviousMonth;
  }

  // Adjust year and month if needed
  if (calculatedMonth < 0) {
    calculatedYear--; // Borrow a year
    calculatedMonth += 12;
  }

  return {
    years: calculatedYear,
    months: calculatedMonth,
    days: calculatedDay,
  };
}

// Attach the click event to the calculate button
calculateButton.addEventListener("click", function () {
  const isDayValid = validateInput(dayInput, dayLabel, dayError);
  const isMonthValid = validateInput(monthInput, monthLabel, monthError);
  const isYearValid = validateInput(yearInput, yearLabel, yearError);

  if (isDayValid && isMonthValid && isYearValid && validateDateFields()) {
    const dayValue = parseInt(dayInput.value);
    const monthValue = parseInt(monthInput.value);
    const yearValue = parseInt(yearInput.value);

    const age = calculateAge(dayValue, monthValue, yearValue);

    // Display the calculated age in the correct span elements
    yearsDisplay.textContent = age.years;
    monthsDisplay.textContent = age.months;
    daysDisplay.textContent = age.days;

    console.log(
      `Age: ${age.years} years, ${age.months} months, and ${age.days} days.`
    );
  }
});
