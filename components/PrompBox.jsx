"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useState } from 'react';

const PrompBox = () => {
    const { sendMessage, isLoading, isDeepThink, setIsDeepThink, quota } = useAppContext();
    const [prompt, setPrompt] = useState('');

    const isBlocked = Boolean(quota?.isResponseBlocked);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim() || isLoading || isBlocked) return;
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
            className={`w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all shadow-xl border ${
                isBlocked ? 'border-red-500/50 bg-[#382d30]' : 'border-gray-600/30'
            }`}
        >
            {isBlocked && (
                <div className="mb-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        Token Limit Reached (20k tokens/4h)
                    </span>
                    <span className="text-[11px] text-red-200">4-hour waiting period active</span>
                </div>
            )}
            <textarea
                className={`outline-none w-full resize-none overflow-y-auto max-h-36 bg-transparent text-white placeholder-gray-400 text-sm leading-relaxed ${
                    isBlocked ? 'cursor-not-allowed text-gray-400' : ''
                }`}
                rows={2}
                disabled={isBlocked}
                placeholder={
                    isBlocked
                        ? 'Token limit reached (20,000 tokens). Please wait for the 4-hour cooldown window to reset...'
                        : 'Message Quick Chat...'
                }
                required
                onKeyDown={handleKeyDown}
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
            />
            <div className='flex items-center text-sm justify-between mt-2 pt-2 border-t border-gray-600/40'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        disabled={isBlocked}
                        onClick={() => setIsDeepThink((prev) => !prev)}
                        className={`flex items-center gap-2 text-xs border px-3 py-1 rounded-full transition ${
                            isBlocked
                                ? 'opacity-40 cursor-not-allowed border-gray-500 text-gray-500'
                                : isDeepThink
                                ? 'bg-blue-600/30 border-blue-400 text-blue-300 font-medium cursor-pointer'
                                : 'border-gray-400/40 text-gray-300 hover:bg-gray-500/20 cursor-pointer'
                        }`}
                    >
                        <Image src={assets.deepthink_icon} alt='' className='h-4 w-4' />
                        DeepThink (R1) {isDeepThink && '✓'}
                    </button>
                    <button
                        type='button'
                        disabled={isBlocked}
                        className={`flex items-center gap-2 text-xs border border-gray-400/40 text-gray-300 px-3 py-1 rounded-full transition ${
                            isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-500/20'
                        }`}
                    >
                        <Image src={assets.search_icon} alt='' className='h-4 w-4' />
                        Search
                    </button>
                </div>

                <div className='flex items-center gap-3'>
                    <Image src={assets.pin_icon} alt='Attach' className={`w-4 ${isBlocked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer opacity-70 hover:opacity-100'} transition`} />
                    <button
                        type='submit'
                        disabled={!prompt.trim() || isLoading || isBlocked}
                        className={`${
                            prompt.trim() && !isLoading && !isBlocked
                                ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
                                : 'bg-[#71717a] cursor-not-allowed'
                        } rounded-full p-2.5 transition flex items-center justify-center`}
                    >
                        <Image src={prompt.trim() && !isBlocked ? assets.arrow_icon : assets.arrow_icon_dull} alt='Send' className='w-3.5 h-3.5 aspect-square' />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PrompBox;