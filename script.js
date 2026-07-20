const forms = document.querySelectorAll(".js-form");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setStatus(form, type, message) {
  const status = form.querySelector(".status-message");
  if (!status) return;

  status.className = `status-message ${type}`;
  status.textContent = message;
}

function isFieldEmpty(field, form) {
  if (field.type === "checkbox") {
    return !field.checked;
  }

  if (field.type === "radio") {
    return !form.querySelector(`input[name="${field.name}"]:checked`);
  }

  return !field.value.trim();
}

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    const hasMissingField = requiredFields.some((field) => isFieldEmpty(field, form));

    if (hasMissingField) {
      setStatus(form, "error", "Please complete all required fields before submitting.");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton.innerHTML;
    const name = form.elements.name?.value.trim() || "there";
    const formType = form.dataset.formType || "request";

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Sending...";

    window.setTimeout(() => {
      form.reset();
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = originalLabel;

      const label = formType === "ticket" ? "support ticket" : "request";
      setStatus(form, "success", `Thanks ${name}. Your ${label} has been received. Scorix will contact you with the next step.`);
    }, 700);
  });
});
