export const formatTime = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);

    const diffInSecs = Math.floor((now-created)/1000);

    if(diffInSecs < 60){
        return "just now";
    }

    const diffInMins = Math.floor(diffInSecs/60);

    if(diffInMins < 60){
        return `${diffInMins}m`;
    }

    const diffInHours = Math.floor(diffInMins/60);

    if(diffInHours < 24){
        return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours/24);

    if(diffInDays === 1){
        return "Yesterday";
    }

    if(diffInDays < 7){
        return created.toLocaleDateString("en-IN",{
            weekday: "long"
        })
    }

    return created.toLocaleDateString("en-IN",{
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};