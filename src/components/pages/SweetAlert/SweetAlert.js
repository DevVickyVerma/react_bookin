import Swal from 'sweetalert2';
import axios from 'axios';

const SweetAlert = ({ title, text, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    });
  };

  return (
    <button onClick={handleConfirm}>Delete</button>
  );
};

export default SweetAlert;
