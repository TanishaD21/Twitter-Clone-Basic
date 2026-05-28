import { useState } from "react";
import { updateUserProfile } from "../api/userApi";
import "./EditProfilePage.css";

const EditProfilePage = ({ user, setUser, setProfiles, refreshProfile, onClose }) => {
    const [formData, setFormData] = useState({
        username: user?.username || "",
        name: user?.name || "",
        bio: user?.bio || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        setLoading(true);
        setError("");

        const response = await updateUserProfile(formData);
        const updatedUser = response?.data?.user;

        if (!updatedUser) {
            throw new Error("Updated user data not found in response");
        }

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        if (setProfiles) {
            setProfiles(updatedUser);
        }

        if (refreshProfile) {
            await refreshProfile();
        }

        onClose();
        } catch (error) {
        console.error(error);
        setError(
            error.response?.data?.message || error.message || "Failed to update profile"
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="edit-profile-overlay">
        <div className="edit-profile-modal">
            <h2>Edit Profile</h2>

            {error && <p className="edit-profile-error">{error}</p>}

            <form onSubmit={handleSubmit} className="edit-profile-form">
            Name <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
            />

            Username <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
            />

            <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                rows="4"
            />

            <div className="edit-profile-actions">
                <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
                </button>

                <button type="button" onClick={onClose} disabled={loading}>
                Cancel
                </button>
            </div>
            </form>
        </div>
        </div>
    );
};

export default EditProfilePage;