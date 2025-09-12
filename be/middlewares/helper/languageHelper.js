// helpers/languageHelper.js

// Define your supported languages
const LANGUAGE_MAP = {
  en: "English",
  tn: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  // Add more as needed
};

/**
 * Get language name from code
 * @param {string} code - Language code (e.g. "en", "tn")
 * @returns {string|null} - Full language name or null if not found
 */
function getLanguageName(code) {
  return LANGUAGE_MAP[code] || null;
}

module.exports = {
  LANGUAGE_MAP,
  getLanguageName,
};
