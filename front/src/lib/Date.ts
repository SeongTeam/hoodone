export function formatTimeFromNow(createdAt: Date) {
    const now = new Date(Date.now());
    const createdTime = new Date(createdAt);

    const distance = Math.floor((now.getTime() - createdTime.getTime()) / 1000);

    if (distance < 60) {
        return `${distance} seconds ago`;
    } else if (distance < 3600) {
        return `${Math.floor(distance / 60)} minutes ago`;
    } else if (distance < 86400) {
        return `${Math.floor(distance / 3600)} hours ago`;
    } else if (distance < 604800) {
        return `${Math.floor(distance / 86400)} days ago`;
    } else if (distance < 2592000) {
        return `${Math.floor(distance / 604800)} weeks ago`;
    } else {
        return `${Math.floor(distance / 2592000)} months ago`;
    }
}

export function formatCreatedAt(createdAt: Date) {
    const createdTime = new Date(createdAt);

    return createdTime.toLocaleDateString();
}
