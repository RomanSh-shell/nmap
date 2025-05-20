// This script handles internationalization (i18n) for the extension.
// It finds elements with `data-i18n` attributes and replaces their content
// with translated strings from the `_locales` directory.

let currentMessages = {}; // Global variable to hold the loaded messages

/**
 * Loads messages for the given language.
 *
 * @param {string} lang The language code (e.g., 'ru', 'en').
 */
async function loadMessages(lang) {
  const path = `/_locales/${lang}/messages.json`;
  try {
    const response = await fetch(chrome.runtime.getURL(path));
    if (!response.ok) {
      throw new Error(`Failed to load messages for ${lang}: ${response.statusText}`);
    }
    const messages = await response.json();
    currentMessages = messages;
    // console.log(`Messages for ${lang} loaded successfully.`);
  } catch (error) {
    console.error(`Error loading messages for ${lang}:`, error);
    // Fallback to Russian if the preferred language fails to load, but not if 'ru' itself fails
    if (lang !== 'ru') {
      console.log('Falling back to Russian (ru).');
      await loadMessages('ru');
    } else {
      // If 'ru' fails, we have a problem. Maybe use a very basic default set or error indicators.
      currentMessages = { "errorLoadingMessages": { "message": "Critical: Default messages failed to load."}};
    }
  }
}

/**
 * Retrieves a translated string from the loaded messages.
 * Manually handles substitutions.
 *
 * @param {string} key The message key to translate.
 * @param {string|string[]} [substitutions] Optional substitutions for placeholders in the message.
 * @returns {string} The translated string, or the key if not found.
 */
function translateString(key, substitutions) {
  if (currentMessages && currentMessages[key] && currentMessages[key].message) {
    let message = currentMessages[key].message;
    if (substitutions) {
      if (Array.isArray(substitutions)) {
        substitutions.forEach((sub, index) => {
          const placeholder = `$${index + 1}`;
          message = message.replace(new RegExp('\\' + placeholder, 'g'), sub);
        });
      } else {
        // Handle single substitution if needed, or define a convention
        message = message.replace(/\$1/g, substitutions.toString());
      }
    }
    return message;
  }
  // console.warn(`Translation key "${key}" not found.`);
  return key; // Return the key itself if not found
}

/**
 * Applies translations to HTML elements in the document.
 * Uses messages from the `currentMessages` object.
 */
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const messageKey = element.dataset.i18n;
    if (messageKey) {
      const translatedString = translateString(messageKey);
      const attributeName = element.dataset.i18nAttribute;

      if (attributeName) {
        element.setAttribute(attributeName, translatedString || messageKey);
      } else {
        element.textContent = translatedString || messageKey;
      }
    }
  });
}

/**
 * Initializes the internationalization by loading the preferred language
 * and then applying translations.
 */
async function initializeI18n() {
  try {
    const result = await new Promise(resolve => chrome.storage.local.get(['selectedLanguage'], resolve));
    const langToLoad = result.selectedLanguage || 'ru'; // Default to 'ru'
    // console.log(`Attempting to load language: ${langToLoad}`);
    await loadMessages(langToLoad);
    applyTranslations();
  } catch (error) {
    console.error("Error during i18n initialization:", error);
    // Fallback or error display if storage access fails
    await loadMessages('ru'); // Load default messages as a last resort
    applyTranslations();
  }
}

// Automatically initialize i18n when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initializeI18n);

// Expose a function to manually re-apply translations if needed after dynamic content load
window.refreshTranslations = applyTranslations;
// Expose a function to change language and reload messages (useful for options page)
window.changeLanguage = async (newLang) => {
    await loadMessages(newLang);
    applyTranslations();
    // Note: The options page itself handles saving the preference and reloading.
    // This function is for cases where other parts of the extension might need to react
    // to a language change without a full page reload, or if the options page logic
    // is refactored to call this.
};
