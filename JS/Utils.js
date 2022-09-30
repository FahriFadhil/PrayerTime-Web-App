export default class Utils {
    static strToHtml(str) {
        let a = document.createElement('div')
        a.innerHTML = str
        return a.firstChild
    }

    static bind(id) {
        return document.getElementById(id)
    }

    static readFormat(format) {
        const f = format.toString().split(':')
        return parseInt(f[0]) * 3600 + parseInt(f[1]) * 60
    }

    static makeFormat(num) {
        const hour = num / 3600
        const minute = num % 3600 / 60
        return `<b>${Math.floor(hour)}</b> Hour <b>${minute}</b> Minute Left`
    }

    static combineTime (...time) {
        return time.reduce((a, b) => a + b)
    }

    static popNotification(msg) {
        const notif = () => new Notification(
            'Prayer Time Reminder', {
                body: 'Hey! It\'s time for ' + msg,
                icon: 'IMG/Logo.png'
            }
        )
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            notif();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    notif();
                }
            });
        }
    }
}