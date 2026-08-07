"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useState } from 'react';

const ChatLabel = ({ chat, openMenu, setOpenMenu }) => {
    const { currentChat, selectChat, renameChat, deleteChat } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(chat.name);

    const isSelected = currentChat?._id === chat._id;
    const isMenuOpen = openMenu.id === chat._id && openMenu.open;

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setOpenMenu({
            id: chat._id,
            open: !isMenuOpen,
        });
    };

    const handleRename = (e) => {
        e.stopPropagation();
        setOpenMenu({ id: 0, open: false });
        const nameInput = prompt("Enter new name for chat:", chat.name);
        if (nameInput && nameInput.trim()) {
            renameChat(chat._id, nameInput.trim());
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setOpenMenu({ id: 0, open: false });
        if (confirm("Are you sure you want to delete this chat?")) {
            deleteChat(chat._id);
        }
    };

    return (
        <div
            onClick={() => selectChat(chat)}
            className={`flex items-center justify-between p-2.5 my-1 text-white/80 rounded-lg text-sm group cursor-pointer transition ${
                isSelected ? 'bg-white/15 text-white font-medium' : 'hover:bg-white/10'
            }`}
        >
            <p className='truncate flex-1 pr-2'>{chat.name || "Untitled Chat"}</p>
            
            <div className='relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/60 rounded-lg'>
                <Image
                    onClick={handleMenuClick}
                    src={assets.three_dots}
                    alt='Menu'
                    className={`w-4 ${isMenuOpen ? 'block' : 'hidden'} group-hover:block cursor-pointer`}
                />

                {isMenuOpen && (
                    <div className='absolute right-0 top-7 bg-[#2d2f36] border border-gray-700 shadow-2xl rounded-xl w-32 p-1 z-50'>
                        <div
                            onClick={handleRename}
                            className='flex items-center gap-2.5 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer text-xs text-gray-200'
                        >
                            <Image src={assets.pencil_icon} alt='' className='w-3.5' />
                            <p>Rename</p>
                        </div>
                        <div
                            onClick={handleDelete}
                            className='flex items-center gap-2.5 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg cursor-pointer text-xs'
                        >
                            <Image src={assets.delete_icon} alt='' className='w-3.5' />
                            <p>Delete</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLabel;