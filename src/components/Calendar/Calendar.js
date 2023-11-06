import React, { useState, useEffect } from "react";
import { Col, Row, Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Swal from "sweetalert2";

function EventCalendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [events, setEvents] = useState([
    { title: "Events", id: "1", style: "primary" },
  ]);
  const [calendarWeekends, setCalendarWeekends] = useState(true);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        return {
          title: title,
          id: id,
        };
      },
    });
  }, []);

  const eventClick = (eventClick) => {
    console.log(eventClick.event, "eventClick");
    Swal.fire({
      title: eventClick.event.title,
      html: (
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <tr>
                <td>Title</td>
                <td>
                  <strong>{eventClick.event.title}</strong>
                </td>
              </tr>
              <tr>
                <td>Start Time</td>
                <td>
                  <strong>{eventClick.event.start}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove Event",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        eventClick.event.remove();
        Swal.fire("Deleted!", "Your Event has been deleted.", "success");
      }
    });
  };

  const addEvent = (date) => {
    // Create a div to structure the form with labels and inputs in one line
    const formDiv = document.createElement("div");

    formDiv.innerHTML = `
        <form id="event-form">
        <div class="form-group row">
  <label for="event-title" class="col-sm-2 col-form-label"> Title:</label>
  <div class="col-sm-9">
    <input id="event-title" class="form-control" required>
  </div>
</div>

       
        
          <div class="form-group row">
          <label for="clockin-date" class="col-sm-3 col-form-label">Clock in :</label>
          <div class="col-sm-4">
            <input id="clockin-date" class="form-control" type="date" required>
          </div>
          <div class="col-sm-4">
            <input id="clockin-time" class="form-control" type="time" required>
          </div>
        </div>


          <div class="form-group row">
          <label for="clockout-date" class="col-sm-3 col-form-label">Clock Out :</label>
          <div class="col-sm-4">
            <input id="clockout-date" class="form-control" type="date" required>
          </div>
          <div class="col-sm-4">
            <input id="clockout-time" class="form-control" type="time" required>
          </div>
        </div>
        
          <div id="total-time" class="total-time"></div>
        </form>
      `;

    const style = document.createElement("style");
    style.textContent = `
        .form-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        label {
          flex: 1;
          margin-right: 2px;
          text-align: start;
        }
        .date-input, .time-input {
          flex: 2;
        }
        .total-time {
          margin-top: 10px;
        }
        .swal2-content {
          text-align: left;
        }
      `;

    // Append the form and styles to the document
    document.head.appendChild(style);

    // Append the form and styles to the document
    Swal.fire({
      title: `Event - ${date}`,
      html: formDiv,
      showCancelButton: true,
      confirmButtonText: "Add Event",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const title = document.getElementById("event-title").value;
        const clockinDate = document.getElementById("clockin-date").value;
        const clockinTime = document.getElementById("clockin-time").value;
        const clockoutDate = document.getElementById("clockout-date").value;
        const clockoutTime = document.getElementById("clockout-time").value;

        if (
          title &&
          clockinDate &&
          clockinTime &&
          clockoutDate &&
          clockoutTime
        ) {
          // Convert date and time strings to Date objects
          const clockinDateTime = new Date(`${clockinDate}T${clockinTime}`);
          const clockoutDateTime = new Date(`${clockoutDate}T${clockoutTime}`);

          // Calculate total time
          const totalTimeMinutes =
            (clockoutDateTime - clockinDateTime) / (1000 * 60);

          // Add the event to the calendar
          setCalendarEvents([
            ...calendarEvents,
            {
              title,
              clockin: clockinDateTime,
              clockout: clockoutDateTime,
              start: date,
              totalTime: totalTimeMinutes,
            },
          ]);
        } else {
          Swal.showValidationMessage("Please fill in all fields.");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    // Calculate total time
    function calculateTotalTime() {
      const clockinDate = document.getElementById("clockin-date").value;
      const clockinTime = document.getElementById("clockin-time").value;
      const clockoutDate = document.getElementById("clockout-date").value;
      const clockoutTime = document.getElementById("clockout-time").value;

      if (clockinDate && clockinTime && clockoutDate && clockoutTime) {
        const clockinDateTime = new Date(`${clockinDate}T${clockinTime}`);
        const clockoutDateTime = new Date(`${clockoutDate}T${clockoutTime}`);
        const totalTimeMinutes =
          (clockoutDateTime - clockinDateTime) / (1000 * 60);

        // Convert total time to days and hours
        const days = Math.floor(totalTimeMinutes / 1440);
        const remainingMinutes = totalTimeMinutes % 1440;
        const hours = Math.floor(remainingMinutes / 60);

        const totalTimeElement = document.getElementById("total-time");
        totalTimeElement.textContent = `Total Time: ${days} days and ${hours} hours`;
      } else {
        const totalTimeElement = document.getElementById("total-time");
        totalTimeElement.textContent = "";
      }
    }

    // Listen for input events to calculate total time
    const clockinDateInput = document.getElementById("clockin-date");
    const clockinTimeInput = document.getElementById("clockin-time");
    const clockoutDateInput = document.getElementById("clockout-date");
    const clockoutTimeInput = document.getElementById("clockout-time");

    clockinDateInput.addEventListener("input", calculateTotalTime);
    clockinTimeInput.addEventListener("input", calculateTotalTime);
    clockoutDateInput.addEventListener("input", calculateTotalTime);
    clockoutTimeInput.addEventListener("input", calculateTotalTime);
  };

  const handleDateClick = (arg) => {
    addEvent(arg.dateStr); // Pass the clicked date to the addEvent function
  };

  return (
    <div className="animated fadeIn demo-app">
      <Row>
        <Col lg={3}>
          <Card>
            <div className="card-header border-0 pb-0">
              <h4 className="card-intro-title mb-0">Calendar</h4>
            </div>
            <Card.Body>
              <div id="external-events">
                {console.log(calendarEvents, "columnIndexevents")}
                {events.map((event) => (
                  <div
                    className={`fc-event external-event light btn-${event.style}`}
                    data-class={`bg-${event.style}`}
                    title={event.title}
                    data={event.id}
                    key={event.id}
                  >
                    <i className="fa fa-move" />
                    <span>{event.title}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card>
            <Card.Body>
              <div className="demo-app-calendar" id="mycalendartest">
                <FullCalendar
                  defaultView="dayGridMonth"
                  headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  rerenderDelay={10}
                  eventDurationEditable={false}
                  editable={true}
                  droppable={true}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  weekends={calendarWeekends}
                  events={calendarEvents}
                  eventClick={eventClick}
                  dateClick={handleDateClick}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EventCalendar;
