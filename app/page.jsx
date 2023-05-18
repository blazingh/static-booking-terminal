"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import AppModal from "./AppModal";

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div>
            <div id="distedaivm-booking-terminal">
                {!modalOpen && !loading && (
                    <button
                        className={styles.AppButton}
                        onClick={() => setModalOpen(true)}
                    >
                        Hemen Randevu Al
                    </button>
                )}
                {modalOpen && !loading && (
                    <AppModal closeModal={() => setModalOpen(false)} />
                )}
            </div>
        </div>
    );
}
