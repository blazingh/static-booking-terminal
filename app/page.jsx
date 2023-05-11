"use client";
import Image from "next/image";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import AppModal from "./AppModal";

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={styles.AppPage}>
            {!modalOpen && (
                <button className={styles.AppButton} onClick={() => setModalOpen(true)}>
                    Make Appointment
                </button>
            )}
            {modalOpen && <AppModal closeModal={() => setModalOpen(false)} />}
        </div>
    );
}
