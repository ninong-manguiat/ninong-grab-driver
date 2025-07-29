
export const PAGES = {
    LOGIN: "/login",
    PROFILE: "/profile",
    TRIP: '/trip',
    TRIPS: '/trips'
}

export const getDateTimeNow = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mnt = today.getMinutes();

    return {
        d: `${mm}-${dd}-${yyyy}`,
        t: `${hh}:${mnt}`
    }
}

export const DRIVER_STATUS = {
    OFFLINE: "UNAVAILABLE",
    AVAILABLE: "AVAILABLE",
    INTRANSIT: "INTRANSIT",
    DRIVER_OTW_ORIGIN: "DRIVER_OTW_ORIGIN",
    DRIVER_ARRIVED_ORIGIN: "DRIVER_ARRIVED_ORIGIN",
    DRIVER_OTW_DESTINATION: "DRIVER_OTW_DESTINATION",
    DRIVER_ARRIVED_DESTINATION: "DRIVER_ARRIVED_DESTINATION",
}

export const BOOKING_STATUS = {
    QUEUE: "QUEUE",
    C1: "Driver Confirmed",
    C2: "Driver is on the way to Client Origin",
    C3: "Driver arrived at Client Origin",
    C4: "Driver is on the way to Client Destination",
    C5: "Driver arrived at Client Destination",
    DONE: "DONE",
    CANCELLED: "CANCELLED",
}