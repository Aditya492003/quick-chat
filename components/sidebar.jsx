"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { useClerk, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useState } from 'react';
import ChatLabel from './ChatLabel';
import QuotaUsage from './QuotaUsage';

const Sidebar = ({ expand, setExpand }) => {
    const { openSignIn } = useClerk();
    const { user, chats, startNewChat } = useAppContext();
    const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

    return (
        <div className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
            <div>
                <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
                    <a href="https://quick-ai-eta-seven.vercel.app/"><Image className={expand ? "w-36" : "w-10"} src={expand ? assets.logo : assets.deepthink_icon} alt='Quick Chat' /></a>

                    <div onClick={() => setExpand(!expand)}
                        className='group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                        <Image src={assets.menu_icon} alt='' className='md:hidden' />
                        <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt='' className='hidden md:block w-7' />
                        <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50`}>
                            {expand ? 'Close sidebar' : 'Open sidebar'}
                            <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "left-1/2 top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}></div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={startNewChat}
                    className={`mt-8 flex items-center cursor-pointer transition ${expand
                        ? "bg-blue-600 hover:bg-blue-500 rounded-full gap-3 py-2.5 px-5 w-full justify-center text-white shadow-lg font-medium"
                        : "group relative h-8 w-8 mx-auto hover:bg-gray-500/30 rounded-lg justify-center"
                        }`}
                >
                    <Image className={expand ? 'w-5' : 'w-6'} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt='' />
                    {!expand && (
                        <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50'>
                            New Chat
                            <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
                        </div>
                    )}
                    {expand && <span>New Chat</span>}
                </button>

                <div className={`mt-8 text-white/40 text-sm ${expand ? "block" : "hidden"}`}>
                    <p className='my-2 text-xs font-semibold uppercase tracking-wider text-gray-400 px-1'>Recents</p>
                    <div className="overflow-y-auto max-h-[calc(100vh-380px)] pr-1">
                        {chats && chats.length > 0 ? (
                            chats.map((chat) => (
                                <ChatLabel
                                    key={chat._id}
                                    chat={chat}
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 px-1 py-2">No recent chats</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <QuotaUsage expand={expand} />



                <div
                    onClick={user ? null : openSignIn}
                    className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3 text-white/70 text-sm p-2 mt-2 cursor-pointer transition`}
                >
                    {user ? <UserButton /> : <Image src={assets.profile_icon} alt='' className='w-7 h-7' />}
                    {expand && <span>{user ? user.fullName || "My Account" : "Sign In"}</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
