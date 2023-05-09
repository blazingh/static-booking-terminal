"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react';

export default function Home() {

    const [modalOpen, setModalOpen] = useState(false);

    const [data, setData] = useState({});

    const [firmInfo, setFirmInfo] = useState({});

    const [doctors, setDoctors] = useState([]);

    const [appointments, setAppointments] = useState([]);

    let url = "";
    if (typeof window !== "undefined" && window.location.href) {

    url = window.location.href.split('/').slice(0,3).join('/').replace(/\/$/, "");
    }

    const getFirmInfo = async () => {
        setFirmInfo({
            name: 'Firm Name',
            logo: 'https://via.placeholder.com/150',
            id: '1',
        });
    }

    console.log(url);

    return (
        <div className={styles.AppPage} >
        {!modalOpen &&
            <button className={styles.AppButton}
          onClick={() => setModalOpen(true)}
            >Make Appointment</button> 
        }
        {modalOpen &&
            <div className={styles.AppModal}>
              <div className={styles.Content}>
                {url}
            <button className={styles.CloseButton} onClick={() => setModalOpen(false)}>X</button>
                </div>
            </div>
        }
        </div>
    )
}
