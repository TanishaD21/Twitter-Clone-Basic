function ProfileCard({user,handleShowFollowers,handleShowFollowing}){
    return (
        <div>
            <div className="profile-card">
                <h3>Name: {user.name || "Unknown Name"}</h3>
                <p>Username: @{user.username || "Username"}</p>
                <p>Email: {user.email|| "Email"}</p>
                <p>Bio: {user.bio || "No bio available"}</p>
                <p>ProfileImage: {user.profileImage}</p>
            </div>
            <div className="profile-stats">
                <button onClick={handleShowFollowers}>
                    Followers: {user.followersCount}
                </button>

                <button onClick={handleShowFollowing}>
                    Following: {user.followingCount}
                </button>
            </div>
        </div>
        
    )
}

export default ProfileCard;

