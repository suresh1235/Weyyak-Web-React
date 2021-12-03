
import LocalizedStrings from 'react-localization';

class i18nModel {
  /**
   * Represents i18n Model.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor() {
    this.oResourceBundle = null;
  }

  /**
   * Component - i18nModel 
   * method that maps state to props.
   * @param {Object} oResourceObject - in this format { en: {key: value, key2: value2 }, ar: {key: value, key2: value2 } }.
   * @return null
   */
  setResourceModels(oResourceObject) {
    this.oResourceBundle = new LocalizedStrings(oResourceObject);
  }

  /**
   * Component - i18nModel 
   * method to chamge locale language.
   * @param {string} languageCode - Lamguage Code.
   * @return null
   */
  setLanguage(languageCode) {
    this.oResourceBundle.setLanguage(languageCode);
  }

  /**
   * Component - i18nModel 
   * method to get the current displayed languagee.
   * @param null
   * @return {string} - current locale language code.
   */
  getLanguage() {
    return this.oResourceBundle.getLanguage();
  }

  /**
   * Component - i18nModel 
   * method to get the current device interface language.
   * @param null
   * @return {string} - current locale language code.
   */
  getInterfaceLanguage() {
    return this.oResourceBundle.getInterfaceLanguage();
  }

  /**
   * Component - i18nModel 
   * method to format the passed string replacing its placeholders with the other arguments strings.
   * @param null
   * @return {string} - current locale language code.
   */
  formatString() {
    this.oResourceBundle.formatString();
  }
}

const oResourceBundleObject = new i18nModel();
export default oResourceBundleObject;