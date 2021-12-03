
import axios from 'axios';

class Axios {
  /**
   * Represents Axios for service calls.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor() {
    this.oAxios = null;
  }

  /**
   * Component - Axios 
   * method that to create Axios object.
   * @param {Object} oInstanceObject - axios configuration
   * @return null
   */
  createInstance(oInstanceObject) {
    this.oAxios = axios.create(oInstanceObject);
  }
  /**
   * Component - Axios 
   * method that set request interceptor configuration
   * @param {function} fnSuccess - success callback
   * @param {function} fnError - success callback
   * @return null
   */
  setRequestInterceptor(fnSuccess, fnError) {
    this.oAxios.interceptors.request.use(fnSuccess, fnError);
  }
  /**
   * Component - Axios 
   * method that set response interceptor configuration
   * @param {function} fnSuccess - success callback
   * @param {function} fnError - success callback
   * @return null
   */
  setResponseInterceptor(fnSuccess, fnError) {
    this.oAxios.interceptors.response.use(fnSuccess, fnError);
  }
  /**
   * Component - Axios 
   * method that return the axios instance
   * @param null
   * @return {Object}
   */
  getInstance() {
    return this.oAxios;
  }

}

export { axios };
export default Axios;