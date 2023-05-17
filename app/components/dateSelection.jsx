import { useRef, useState, useEffect } from "react";

import SvgArrow from "../icons/Arrow";

import styles from "./date.module.css";

function DateSelection({
  handleAppointmentSelection,
  clinicId,
  doctorId,
  scrollToBottom,
}) {
  const sliderRef = useRef(null);

  const [monthName, setmonthName] = useState("");
  const [dayName, setdayName] = useState("");
  const [dates, setDates] = useState([]);

  const [selected, setSelected] = useState(null);

  const [appointments, setAppointments] = useState({
    data: null,
    loading: false,
    error: false,
    date: new Date().toISOString().slice(0, 10),
  });

  const scroll = (scrollOffset) => {
    sliderRef.current.scrollLeft += scrollOffset;
  };

  const getdates = () => {
    const months = {
      tr: [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
      ],
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
    const weekday = {
      tr: [
        "Pazar",
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
      ],
      en: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
    const today = new Date();
    const datearray = [];
    setmonthName(months.tr[today.getMonth()]);
    setdayName(weekday.tr[today.getDay()]);
    for (let i = 0; i < 30; i += 1) {
      const newdate = new Date(today);
      newdate.setDate(newdate.getDate() + i);
      const dateitem = {
        date: newdate.toISOString().slice(0, 10),
        day: weekday.tr[newdate.getDay()],
        month: months.tr[newdate.getMonth()],
      };
      datearray.push(dateitem);
    }
    return datearray;
  };
  const getAppointments = async () => {
    setAppointments((p) => ({ ...p, loading: true, error: false }));
    const result = await fetch(
      `https://betaapi.dtsanalpos.com/api/treatments/plan/availability?clinic_id=${clinicId}&doctor_id=${doctorId}&date=${appointments.date}`
    );
    const data = await result.json();
    if (data.message === "Success") {
      const dates = Object.keys(data.result);
      const dateObj = [];
      dates.forEach((date) => {
        const date2 = date.split(" ")[0];
        const time = date.split(" ")[1].split(":");
        dateObj.push({
          date: date2,
          time: `${time[0]}:${time[1]}`,
          active: data.result[date].active,
          id: data.result[date].id,
        });
        setAppointments((p) => ({ ...p, data: dateObj, loading: false }));
      });
    } else {
      setAppointments((p) => ({ ...p, error: true, loading: false }));
    }
  };

  const buttonRef = useRef(null);

  useEffect(() => {
    getAppointments();
    setDates(getdates());
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    getAppointments();
    setSelected(null);
  }, [appointments.date]);

  useEffect(() => {
    // wait 1 sec
    if (!selected) return;
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [selected]);

  return (
    <div className={styles.container}>
      <div className={styles.secondary}>
        <SvgArrow
          orient="left"
          onClick={() => scroll(-200)}
          className={styles.arrowleft}
          height={24}
          width={24}
        />
        <div className={styles.dateselector} ref={sliderRef}>
          {dates.map((d, index) => (
            <div
              key={index}
              className={styles.datecontainer}
              onClick={() => {
                setAppointments((p) => ({ ...p, date: d.date }));
                setmonthName(d.month);
                setdayName(d.day);
              }}
            >
              <div
                key={index}
                className={
                  appointments.date === d.date
                    ? styles.dateselected
                    : styles.date
                }
              >
                <div className={styles.day}>{d.date.split("-")[2]}</div>
                <div className={styles.month}>{d.month}</div>
                {appointments.date === d.date && (
                  <svg
                    className={styles.poly}
                    width="18"
                    height="9"
                    viewBox="0 0 18 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.83928 1.75L9 7.61888L15.1607 1.75H2.83928Z"
                      fill="#5D5FEF"
                      stroke="#5D5FEF"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
              <div className={styles.dayname}>{d.day}</div>
            </div>
          ))}
        </div>
        <SvgArrow
          orient="right"
          onClick={() => scroll(200)}
          className={styles.arrowright}
          height={24}
          width={24}
        />
      </div>
      {appointments.loading && (
        <div className={styles.message + " " + styles.loading}>loading...</div>
      )}
      {!appointments.loading &&
        (appointments.error ||
          !appointments.data ||
          appointments.data.length === 0) && (
          <span className={styles.message + " " + styles.error}>
            yoklamaya uygun randevu bulunamadı
          </span>
        )}
      {!appointments.loading && !appointments.error && appointments.data && (
        <div>
          <div className={styles.applist}>
            {appointments.data?.map((app, index) => {
              if (app.active && selected?.id === app.id)
                return (
                  <div
                    key={index}
                    className={styles.appselected}
                    onClick={() => app.active && setSelected(null)}
                  >
                    {app.time}
                  </div>
                );
              if (app.active && selected?.id !== app.id)
                return (
                  <div
                    key={index}
                    className={styles.appactive}
                    onClick={() =>
                      app.active && setSelected({ ...app, monthName, dayName })
                    }
                  >
                    {app.time}
                  </div>
                );
              if (!app.active)
                return (
                  <div key={index} className={styles.appdisabled}>
                    {app.time}
                  </div>
                );
              return null;
            })}
            {selected && (
              <div className={styles.button_cont}>
                <button
                  ref={buttonRef}
                  type="button"
                  className={styles.button}
                  onClick={() => handleAppointmentSelection(selected)}
                >
                  Randevu Tarihini Onayla
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DateSelection;
