import './navbar.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function Navbar(){
    const { user, logout } = useContext(AuthContext);
    

    
    return(
        <div className="navbar">
            {/* Twitter/X logo */}
            <div className="logo">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" height="24px" width="24px">
                    <g>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </g>
                </svg>
            </div>

            {user ? (
                <>
                    <div className="navbar_links">
                        <Link to="/" className="navbar_link">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true"><path d="M10.059 2.593c1.175-.784 2.707-.784 3.882 0l6.5 4.333C21.415 7.575 22 8.668 22 9.838V18.5c0 1.933-1.567 3.5-3.5 3.5h-4.25v-5.25c0-1.243-1.007-2.25-2.25-2.25s-2.25 1.007-2.25 2.25V22H5.5C3.567 22 2 20.433 2 18.5V9.838c0-1.17.585-2.263 1.559-2.912l6.5-4.333z"></path></svg>
                            Home
                        </Link>

                        <Link to="/profile" className="navbar_link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true"><path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path><circle cx="12" cy="7" r="4"/></svg>
                            Profile
                        </Link>
                    </div>

                    <Link to="/post" className="navbar-post-btn">
                        Post
                    </Link>

                    <div className="spacer" style={{ flex: 1 }} />

                    <div className="navbar-user-profile" onClick={logout} title="Log out">
                        <div className="navbar-avatar" style={{ background: '#1d9bf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="navbar-user-info">
                            <span className="navbar-display-name">{user.name}</span>
                            <span className="navbar-username">@{user.username || 'user'}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="navbar_links">
                        <Link to="/login" className="navbar_link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                            Login
                        </Link>
                        <Link to="/signup" className="navbar_link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                            Sign Up
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Navbar;