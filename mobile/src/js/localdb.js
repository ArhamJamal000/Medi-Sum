/**
 * Medi-Sum Local Database
 * Uses @capacitor/preferences for key-value storage (reminders)
 * Uses @capacitor/filesystem for local image caching
 */

let Preferences = null;
let Filesystem = null;
let Directory = null;

// Lazy-load Capacitor plugins
async function loadPlugins() {
    if (!Preferences) {
        try {
            const mod = await import('@capacitor/preferences');
            Preferences = mod.Preferences;
        } catch (e) {
            console.warn('Preferences plugin not available, using localStorage fallback');
        }
    }
    if (!Filesystem) {
        try {
            const mod = await import('@capacitor/filesystem');
            Filesystem = mod.Filesystem;
            Directory = mod.Directory;
        } catch (e) {
            console.warn('Filesystem plugin not available');
        }
    }
}

// ══════════ Key-Value Store ══════════

async function getItem(key) {
    await loadPlugins();
    try {
        if (Preferences) {
            const { value } = await Preferences.get({ key });
            return value ? JSON.parse(value) : null;
        }
        const val = localStorage.getItem(`medi_${key}`);
        return val ? JSON.parse(val) : null;
    } catch (e) {
        console.error('LocalDB get error:', e);
        return null;
    }
}

async function setItem(key, value) {
    await loadPlugins();
    try {
        const json = JSON.stringify(value);
        if (Preferences) {
            await Preferences.set({ key, value: json });
        } else {
            localStorage.setItem(`medi_${key}`, json);
        }
    } catch (e) {
        console.error('LocalDB set error:', e);
    }
}

async function removeItem(key) {
    await loadPlugins();
    try {
        if (Preferences) {
            await Preferences.remove({ key });
        } else {
            localStorage.removeItem(`medi_${key}`);
        }
    } catch (e) {
        console.error('LocalDB remove error:', e);
    }
}

// ══════════ Reminders CRUD ══════════

export async function getReminders() {
    return (await getItem('reminders')) || [];
}

export async function saveReminder(reminder) {
    const reminders = await getReminders();
    // Generate ID if not present
    if (!reminder.id) {
        reminder.id = Date.now() + Math.floor(Math.random() * 1000);
    }
    // Check if updating existing
    const idx = reminders.findIndex(r => r.id === reminder.id);
    if (idx >= 0) {
        reminders[idx] = { ...reminders[idx], ...reminder };
    } else {
        reminders.push(reminder);
    }
    await setItem('reminders', reminders);
    return reminder;
}

export async function deleteReminder(id) {
    const reminders = await getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await setItem('reminders', filtered);
}

export async function toggleReminder(id, enabled) {
    const reminders = await getReminders();
    const r = reminders.find(r => r.id === id);
    if (r) {
        r.enabled = enabled;
        await setItem('reminders', reminders);
    }
    return r;
}

export async function getRemindersForMedicine(medicineName) {
    const reminders = await getReminders();
    return reminders.filter(r => r.medicineName.toLowerCase() === medicineName.toLowerCase());
}

// ══════════ Local Image Storage ══════════

const IMG_MAP_KEY = 'prescription_images';

async function getImageMap() {
    return (await getItem(IMG_MAP_KEY)) || {};
}

export async function saveImageLocally(prescriptionId, base64Data) {
    await loadPlugins();
    const fileName = `rx_${prescriptionId}.jpg`;

    try {
        if (Filesystem && Directory) {
            await Filesystem.writeFile({
                path: `medisum/${fileName}`,
                data: base64Data,
                directory: Directory.Data,
                recursive: true
            });
            // Store mapping
            const map = await getImageMap();
            map[prescriptionId] = { fileName, timestamp: Date.now(), stored: true };
            await setItem(IMG_MAP_KEY, map);
            return true;
        } else {
            // Web fallback: store in localStorage (limited but functional)
            const map = await getImageMap();
            map[prescriptionId] = { base64: base64Data.substring(0, 500000), timestamp: Date.now(), stored: true };
            await setItem(IMG_MAP_KEY, map);
            return true;
        }
    } catch (e) {
        console.error('Failed to save image locally:', e);
        return false;
    }
}

export async function getLocalImage(prescriptionId) {
    await loadPlugins();
    const map = await getImageMap();
    const entry = map[prescriptionId];
    if (!entry) return null;

    try {
        if (Filesystem && Directory && entry.fileName) {
            const result = await Filesystem.readFile({
                path: `medisum/${entry.fileName}`,
                directory: Directory.Data
            });
            return { data: result.data, isLocal: true };
        } else if (entry.base64) {
            return { data: entry.base64, isLocal: true };
        }
    } catch (e) {
        console.warn('Local image read failed:', e);
    }
    return null;
}

export async function hasLocalImage(prescriptionId) {
    const map = await getImageMap();
    return !!(map[prescriptionId]?.stored);
}

export async function deleteLocalImage(prescriptionId) {
    await loadPlugins();
    const map = await getImageMap();
    const entry = map[prescriptionId];

    if (entry?.fileName && Filesystem && Directory) {
        try {
            await Filesystem.deleteFile({
                path: `medisum/${entry.fileName}`,
                directory: Directory.Data
            });
        } catch (e) { /* file may not exist */ }
    }

    delete map[prescriptionId];
    await setItem(IMG_MAP_KEY, map);
}
