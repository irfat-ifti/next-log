import { showToast } from "nextjs-toast-notify";

export default function ShowToast({ message, type }) {
    if (type === "success") {
        showToast.success(message, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "fadeIn",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
            sound: true,
        });
    } else if (type === "error") {
        showToast.error(message, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "fadeIn",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
            sound: true,
        });
    } else if (type === "warning") {
        showToast.warning(message, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "fadeIn",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
            sound: true,
        });
    } else {
        showToast.info(message, {
            duration: 4000,
            progress: true,
            position: "top-right",
            transition: "fadeIn",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
            sound: true,
        });
    }
}

export { ShowToast };
