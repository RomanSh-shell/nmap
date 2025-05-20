'use strict';

/**
 * Скрипт для раздела модулей
 */

(function () {
  let settings = {};
  const languageSwitcher = document.getElementById('language-switcher');

  // Function to load and apply saved language
  const loadLanguageSetting = () => {
    chrome.storage.local.get(['selectedLanguage'], function(result) {
      const savedLang = result.selectedLanguage;
      if (savedLang) {
        languageSwitcher.value = savedLang;
      } else {
        // Default to Russian if no language is saved
        languageSwitcher.value = 'ru';
        // Optionally, save this default
        // chrome.storage.local.set({selectedLanguage: 'ru'}); 
      }
    });
  };

  // Function to handle language change
  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    chrome.storage.local.set({selectedLanguage: newLang}, function() {
      // Reload the page to apply the new language
      // The actual translation logic will be updated in i18n.js in a future step
      window.location.reload();
    });
  };

  // Add event listener for language switcher
  if (languageSwitcher) {
    languageSwitcher.addEventListener('change', handleLanguageChange);
  }

  // Load language setting on page load
  loadLanguageSetting();

  const renderSetting = () => {
    for (let name in settings) {
      const id = name.replace(":", "_");
      const value = settings[name];
      const checkbox = $("#" + id);
      const checkboxContent = checkbox.parent().parent();

      if (value) {
        checkbox.attr("checked", true);
        checkboxContent.addClass("checkbox_checked_yes");
      }

      checkbox.on("input", () => {
        settings[name] = !checkbox.attr("checked");

        checkbox.attr("checked", !checkbox.attr("checked"));
        checkboxContent.toggleClass("checkbox_checked_yes");

        chrome.storage.local.set({ "nkSetting": settings });
      });
    }
  };

  chrome.storage.local.get(["nkSetting"], (result) => {
    settings = result.nkSetting;

    if (!settings) {
      chrome.runtime.sendMessage({method: "setSetting"}, (response) => {
        settings = response.response;

        renderSetting();
      });
    }else {
      renderSetting();
    }
  });
})();