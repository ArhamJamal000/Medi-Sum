
document.addEventListener('DOMContentLoaded', function () {
    console.log("MediSum Notification System Loaded");

    const notificationBtn = document.getElementById('enable-notifications-btn');
    const testBtn = document.getElementById('test-notification-btn');

    // Check if browser supports notifications
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
        return;
    }

    // Update UI based on permission
    updateNotificationUI();

    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            Notification.requestPermission().then(function (permission) {
                updateNotificationUI();
                if (permission === "granted") {
                    new Notification("MediSum", { body: "Notifications enabled successfully!" });
                }
            });
        });
    }

    if (testBtn) {
        testBtn.addEventListener('click', function () {
            if (Notification.permission === "granted") {
                new Notification("MediSum Test", {
                    body: "This is a test reminder from MediSum!",
                    icon: "/static/favicon.ico" // Optional icon
                });
            } else {
                alert("Please enable notifications first.");
            }
        });
    }

    // Auto-check for reminders (if data is injected)
    if (typeof activeMedicines !== 'undefined' && activeMedicines.length > 0) {
        if (Notification.permission === "granted") {
            // Check if we already notified today (simple local storage check to avoid spam on refresh)
            const today = new Date().toDateString();
            const lastNotified = localStorage.getItem('last_med_notification');

            if (lastNotified !== today) {
                activeMedicines.forEach(med => {
                    new Notification(`Time to take: ${med.name}`, {
                        body: `Dosage: ${med.dosage || 'As prescribed'}\nFrequency: ${med.frequency || 'Daily'}`,
                        requireInteraction: true
                    });
                });
                localStorage.setItem('last_med_notification', today);
            }
        }
    }
});

function updateNotificationUI() {
    const btn = document.getElementById('enable-notifications-btn');
    if (!btn) return;

    if (Notification.permission === "granted") {
        btn.textContent = "✅ Notifications Enabled";
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-success');
        btn.disabled = true;
    } else if (Notification.permission === "denied") {
        btn.textContent = "❌ Notifications Denied";
        btn.classList.add('btn-danger');
        btn.disabled = true;
    } else {
        btn.textContent = "🔔 Enable Notifications";
    }
}
