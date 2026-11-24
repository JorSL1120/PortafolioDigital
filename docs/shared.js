document.addEventListener("DOMContentLoaded", () => {
  const translated = Array.from(document.querySelectorAll("[data-en], [data-en-html]")).map(element => ({
    element,
    spanish: element.innerHTML,
    english: element.dataset.enHtml ?? element.dataset.en,
    html: element.hasAttribute("data-en-html")
  }));
  const translatedLabels = Array.from(document.querySelectorAll("[data-en-aria]")).map(element => ({
    element,
    spanish: element.getAttribute("aria-label"),
    english: element.dataset.enAria
  }));
  const buttons = document.querySelectorAll("[data-language]");
  let language = "es";

  const setLanguage = (next, persist = true) => {
    language = next === "en" ? "en" : "es";
    document.documentElement.lang = language;
    translated.forEach(({ element, spanish, english, html }) => {
      if (language === "es") element.innerHTML = spanish;
      else if (html) element.innerHTML = english;
      else element.textContent = english;
    });
    translatedLabels.forEach(({ element, spanish, english }) => {
      element.setAttribute("aria-label", language === "en" ? english : spanish);
    });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    if (persist) {
      try {
        localStorage.setItem("preferredLang", language);
      } catch (error) {
        console.warn("No se pudo guardar la preferencia de idioma.", error);
      }
    }
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
  };

  buttons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  document.addEventListener("click", event => {
    document.querySelectorAll(".social-menu[open]").forEach(menu => {
      if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") document.querySelectorAll(".social-menu[open]").forEach(menu => menu.removeAttribute("open"));
  });

  try {
    setLanguage(localStorage.getItem("preferredLang"), false);
  } catch (error) {
    console.warn("No se pudo leer la preferencia de idioma.", error);
    setLanguage("es", false);
  }
});
