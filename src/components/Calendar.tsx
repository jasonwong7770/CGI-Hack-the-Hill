import { useState } from 'react'

export default function Calendar() {
    const [selectedDay, setSelectedDay] = useState<number | null>(null)

    const [appointmentTime, setAppointmentTime] = useState("")
    const [appointmentSubmitted, setAppointmentSubmitted] = useState(false)
    const [appointmentReason, setAppointmentReason] = useState("")

    const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1))

    const getDate = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    }

    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const days = Array.from({length: getDate() }, (_, index) => index + 1)
    const today = new Date()

    const firstDay = currentDate.getDay()

    return (
        <section className="card">
            <h2>Calendar</h2>

            <div className="top-bar">
                <button onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
                    setSelectedDay(null)
                }}>
                    ←
                </button>

                <h3>
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h3>

                <button onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
                    setSelectedDay(null)
                }}>
                    →
                </button>
            </div>

            <div className="weekdays">
                {week.map((day) => (
                    <p key={day}>{day}</p>
                ))}
            </div>

            <div className="calendar-days">
                {Array.from({length: firstDay }).map((_, index) => (
                    <div key = {index}></div>
                ))}

                {days.map((day) => {
                    const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const isPast = calendarDate < today

                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`${selectedDay === day ? "selected" : ""} ${isPast ? "past" : ""}`}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {selectedDay && (
                <div className="appointment-form">
                    <p>
                        Selected Date: {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}, {currentDate.getFullYear()}
                    </p>

                    <label>
                        Appointment Time
                        <input
                            type="time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                        />
                    </label>

                    <label>
                        Reason for Appointment
                        <textarea
                            value={appointmentReason}
                            onChange={(e) => setAppointmentReason(e.target.value)}
                            placeholder="Describe the reason for your appointment"
                        />
                    </label>

                    <button
                        onClick={() => {
                            setAppointmentSubmitted(true)
                            setAppointmentTime("")
                            setAppointmentReason("")
                        }}
                        disabled={!appointmentTime || !appointmentReason}
                    >
                        Submit
                    </button>

                    {appointmentSubmitted && (
                        <p className="info">Appointment submitted successfully</p>
                    )}
                </div>
            )}
        </section>
    )
}