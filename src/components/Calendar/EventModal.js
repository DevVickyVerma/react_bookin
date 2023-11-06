import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const EventModal = ({ isOpen, closeModal, eventData, handleEventAdd, setEventData }) => {
  const handleSubmit = () => {
    handleEventAdd(eventData);
    setEventData({ title: '', start: '', end: '' }); // Reset event data
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Add Event Modal"
    >
      <h2>Add Event</h2>
      <input
        type="text"
        placeholder="Event title"
        value={eventData.title}
        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default EventModal;
