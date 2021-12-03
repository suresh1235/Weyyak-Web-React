import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class Toaster extends React.PureComponent {

  render() {
    return (
      <ToastContainer
        position="bottom-center"
        autoClose={this.props.autoClose || 3000}
        rtl={this.props.rtl}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        pauseOnVisibilityChange
        draggable={false}
        pauseOnHover={false}
      />
    );
  }
}

export { Toaster, toast };
