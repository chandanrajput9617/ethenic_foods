import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { useHistory } from "react-router-dom";
import { useAdminState } from '@contexts/AdminContext';
import avatar from '@assets/avatar4.jpg';
import axios from 'axios';

const UserProfile = (userData) => {
    const { currentColor } = useAdminState();
    const navigate = useHistory();
    const handleClick = async () => {
          localStorage.clear();
          navigate.push("/");
    };
    return (
        <div className="nav-item absolute top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96" style={{zIndex: 9999}}>
        <div className="flex justify-between items-center">
                <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
                <Button
                    icon={<MdOutlineCancel size={36} />}
                    color="rgb(153, 171, 180)"
                    bgHoverColor="light-gray"
                    size="2xl"
                    borderRadius="50%"
                />
            </div>
            <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
                <img
                    className="rounded-full h-24 w-24"
                    src={avatar}
                    alt="user-profile"
                />
                <div>
                    <p className="font-semibold text-xl dark:text-gray-200">{userData?.userData.username}</p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">  Administrator   </p>
                    <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">{userData?.userData.email}</p>
                </div>
            </div>

            <div className="mt-5" >
            <LogoutButton handleClick={handleClick} />
        </div>
        </div>

    );
};

const Button = ({
    icon,
    bgColor,
    color,
    bgHoverColor,
    size,
    text,
    borderRadius,
    width,
}) => {
    const { setIsClicked, initialState } = useAdminState();

    return (
        <button
            type="button"
            onClick={() => setIsClicked(initialState)}
            style={{ backgroundColor: bgColor, color, borderRadius }}
            className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
        >
            {icon} {text}
        </button>
    );
};
const LogoutButton = ({ handleClick }) => {
    const { currentColor } = useAdminState();

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{ backgroundColor: currentColor, color: "white", borderRadius: "10px" }}
            className="text-2xl p-3 w-full hover:drop-shadow-xl hover:bg-light-gray"
        >
            Logout
        </button>
    );
};
export default UserProfile;
