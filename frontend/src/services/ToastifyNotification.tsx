// ToastifyNotification.tsx
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ToastifyNotification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover={false} // tắt để test
      pauseOnFocusLoss={false} // tắt để test
      draggable
      theme="colored"
    />
  );
}
