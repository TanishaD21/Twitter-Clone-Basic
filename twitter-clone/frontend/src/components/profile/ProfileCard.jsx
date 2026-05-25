function ProfileCard({user}){
    return (
        <div className="profile-card">
            <h3>Name: {user.name || "Unknown Name"}</h3>
            <p>Username: @{user.username || "Username"}</p>
            <p>Email: {user.email|| "Email"}</p>
            <p>Bio: {user.bio || "No bio available"}</p>
            <p>ProfileImage: {user.profileImage}</p>
        </div>

    )
}

export default ProfileCard;

