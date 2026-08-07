"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useState } from 'react';

const PrompBox = () => {
    const { sendMessage, isLoading, isDeepThink, setIsDeepThink } = useAppContext();
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        sendMessage(prompt.trim());
        setPrompt('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all shadow-xl border border-gray-600/30'
        >
            <textarea
                className='outline-none w-full resize-none overflow-y-auto max-h-36 bg-transparent text-white placeholder-gray-400 text-sm leading-relaxed'
                rows={2}
                placeholder='Message Quick Chat...'
                required
                onKeyDown={handleKeyDown}
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
            />
            <div className='flex items-center text-sm justify-between mt-2 pt-2 border-t border-gray-600/40'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setIsDeepThink((prev) => !prev)}
                        className={`flex items-center gap-2 text-xs border px-3 py-1 rounded-full transition cursor-pointer ${
                            isDeepThink
                                ? 'bg-blue-600/30 border-blue-400 text-blue-300 font-medium'
                                : 'border-gray-400/40 text-gray-300 hover:bg-gray-500/20'
                        }`}
                    >
                        <Image src={assets.deepthink_icon} alt='' className='h-4 w-4' />
                        DeepThink (R1) {isDeepThink && '✓'}
                    </button>
                    <button
                        type='button'
                        className='flex items-center gap-2 text-xs border border-gray-400/40 text-gray-300 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'
                    >
                        <Image src={assets.search_icon} alt='' className='h-4 w-4' />
                        Search
                    </button>
                </div>

                <div className='flex items-center gap-3'>
                    <Image src={assets.pin_icon} alt='Attach' className='w-4 cursor-pointer opacity-70 hover:opacity-100 transition' />
                    <button
                        type='submit'
                        disabled={!prompt.trim() || isLoading}
                        className={`${
                            prompt.trim() && !isLoading ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer' : 'bg-[#71717a] cursor-not-allowed'
                        } rounded-full p-2.5 transition flex items-center justify-center`}
                    >
                        <Image src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull} alt='Send' className='w-3.5 h-3.5 aspect-square' />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PrompBox;