let _notificationCallback;

export default {
    setNotificationCallback(fn) {
        _notificationCallback = fn;
    },
    showNotification(text) {
        if (_notificationCallback && typeof _notificationCallback === "function") {
            _notificationCallback(text);
        }
    }
}