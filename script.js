const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let expression = "";

function render(value) {
  display.value = value || "0";
}

function appendValue(value) {
  const operators = ["+", "-", "*", "/", "%"];
  const last = expression.at(-1);

  if (operators.includes(value) && operators.includes(last)) {
    expression = expression.slice(0, -1) + value;
    render(expression);
    return;
  }

  if (value === ".") {
    const currentSegment = expression.split(/[+\-*/%]/).at(-1);
    if (currentSegment.includes(".")) {
      return;
    }
  }

  expression += value;
  render(expression);
}

function clearAll() {
  expression = "";
  render(expression);
}

function deleteLast() {
  expression = expression.slice(0, -1);
  render(expression);
}

function calculate() {
  if (!expression) {
    return;
  }

  try {
    // Evaluate only calculator characters.
    if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    const result = Function(`"use strict"; return (${expression})`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Math error");
    }

    expression = String(result);
    render(expression);
  } catch {
    expression = "";
    render("Error");
  }
}

keys.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { value, action } = target.dataset;

  if (action === "clear") {
    clearAll();
    return;
  }

  if (action === "delete") {
    deleteLast();
    return;
  }

  if (action === "equals") {
    calculate();
    return;
  }

  if (value) {
    appendValue(value);
  }
});

window.addEventListener("keydown", (event) => {
  if ((event.key >= "0" && event.key <= "9") || ["+", "-", "*", "/", "%", "."].includes(event.key)) {
    appendValue(event.key);
    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    calculate();
    return;
  }

  if (event.key === "Backspace") {
    deleteLast();
    return;
  }

  if (event.key === "Escape") {
    clearAll();
  }
});
