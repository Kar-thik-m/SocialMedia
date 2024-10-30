import React, { useEffect, useState } from "react";
import ProStyle from "../Profile/Profile.module.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetProfileByUser, UnFollow, Follow } from "../../Redux/Action/ProfileAction";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from "../../contextApi/AuthContext";

const Profile = () => {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { userByIdProfile } = useSelector((state) => state.profile);
    const [modalType, setModalType] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetProfileByUser(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (user && userByIdProfile) {
            setIsFollowing(user.followers.includes(userByIdProfile._id));
        }
    }, [user, userByIdProfile]);

    const toggleModal = (type) => {
        setModalType((prev) => (prev === type ? null : type));
    };

    const handleFollowToggle = async () => {
        const action = isFollowing ? UnFollow : Follow;
        try {
            await dispatch(action(userByIdProfile._id));
            setIsFollowing(!isFollowing);
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {userByIdProfile && user && (
                <div className={ProStyle.container}>
                    <div className={ProStyle.profiles}>
                        <img className={ProStyle.profileimage} src={userByIdProfile?.userimage?.url} alt="Profile" />
                        <div className={ProStyle.profilename}>{userByIdProfile.username}</div>
                        <div className={ProStyle.gmail}>{userByIdProfile.email.split('@')[0]}</div>
                        <div className={ProStyle.follows}>
                            <div className={ProStyle.following} onClick={() => toggleModal('following')}>
                                <b>{userByIdProfile.following.length}</b> following
                            </div>
                            <div className={ProStyle.followers} onClick={() => toggleModal('followers')}>
                                <b>{userByIdProfile.followers.length}</b> followers
                            </div>
                        </div>
                        {user._id === userByIdProfile._id ? (
                            <>
                                <Link className={ProStyle.edit} to={`/editprofile/${user._id}`}>
                                    Edit Profile
                                </Link>

                            </>
                        ) : (
                            <>
                                <button onClick={handleFollowToggle} className={isFollowing ? ProStyle.unfollow : ProStyle.follow}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                                <Link className={ProStyle.edit} to={`/inbox/${id}`}>Message</Link>
                            </>
                        )}

                    </div>

                    {(modalType === 'following' || modalType === 'followers') && (
                        <div className={ProStyle.backfollows}>
                            <div className={ProStyle.centerfollowing}>
                                <div className={ProStyle.showfollowing}>
                                    <div>
                                        {modalType === "following" ? `${userByIdProfile.following.length} followings` : `${userByIdProfile.followers.length} followers`}
                                    </div>
                                    <i onClick={() => toggleModal(modalType)} className="fa fa-times" aria-hidden="true"></i>
                                </div>
                                <div>
                                    {(modalType === 'following' ? userByIdProfile.following : userByIdProfile.followers).map((item) => (
                                        <div className={ProStyle.followingdetails} key={item._id}>
                                            <div>
                                                <img className={ProStyle.followingimgs} src={item?.userimage?.url} alt={item.username} />
                                                <div>{item.username}</div>
                                            </div>
                                            <button
                                                className={user.following.includes(item._id) ? ProStyle.unfollow : ProStyle.follow}
                                                onClick={async () => {
                                                    const action = user.following.includes(item._id) ? UnFollow : Follow;

                                                    try {
                                                        await dispatch(action(item._id));

                                                        if (action === Follow) {
                                                            user.following.push(item._id);
                                                        } else {
                                                            user.following = user.following.filter(followingId => followingId !== item._id);
                                                        }
                                                    } catch (error) {
                                                        alert(error.message);
                                                    }
                                                }}
                                            >
                                                {user.following.includes(item._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Profile;
