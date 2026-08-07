"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-3 rounded-xl overflow-hidden bg-[#18181c] border border-gray-700/60 shadow-md">
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#121215] text-xs text-gray-400 border-b border-gray-800">
                <span className="font-mono text-gray-300 font-semibold">{language ? language.toUpperCase() : 'CODE'}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition text-xs cursor-pointer"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-gray-100 leading-relaxed bg-[#18181c] whitespace-pre-wrap">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const Message = ({ role, content }) => {
    const { sendMessage } = useAppContext();

    const handleCopyText = () => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
    };

    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && (match || codeContent.includes('\n'))) {
                return <CodeBlock language={match ? match[1] : ''} code={codeContent} />;
            }
            return (
                <code className="bg-gray-800/80 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                    {children}
                </code>
            );
        },
        p({ children }) {
            return <p className="mb-3 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
            return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
        },
        ol({ children }) {
            return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
        },
        li({ children }) {
            return <li className="ml-2">{children}</li>;
        },
        h1({ children }) {
            return <h1 className="text-xl font-bold my-3 text-white">{children}</h1>;
        },
        h2({ children }) {
            return <h2 className="text-lg font-bold my-2 text-white">{children}</h2>;
        },
        h3({ children }) {
            return <h3 className="text-base font-bold my-2 text-white">{children}</h3>;
        },
        table({ children }) {
            return <div className="overflow-x-auto my-3"><table className="min-w-full divide-y divide-gray-700 border border-gray-700">{children}</table></div>;
        },
        th({ children }) {
            return <th className="px-3 py-2 bg-gray-800 text-left text-xs font-semibold uppercase">{children}</th>;
        },
        td({ children }) {
            return <td className="px-3 py-2 border-t border-gray-700 text-xs">{children}</td>;
        }
    };

    return (
        <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
            <div className={`flex flex-col w-full mb-6 ${role === 'user' && 'items-end'}`}>
                <div className={`group relative flex max-w-2xl py-3 rounded-2xl ${role === 'user' ? 'bg-[#393a42] px-5 text-white shadow-md' : 'gap-3 text-gray-200'}`}>

                    <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-14 top-3' : 'left-10 -bottom-6'} transition-all z-10`}>
                        <div className='flex items-center gap-2 bg-[#1e1e24] px-2 py-1 rounded-md border border-gray-700 shadow-md'>
                            <Image
                                src={assets.copy_icon}
                                alt='Copy'
                                title='Copy message'
                                onClick={handleCopyText}
                                className='w-4 cursor-pointer hover:opacity-80 transition'
                            />
                            {role !== 'user' && (
                                <Image
                                    src={assets.regenerate_icon}
                                    alt='Regenerate'
                                    title='Regenerate'
                                    onClick={() => sendMessage(content)}
                                    className='w-4 cursor-pointer hover:opacity-80 transition'
                                />
                            )}
                        </div>
                    </div>

                    {role === 'user' ? (
                        <span className='text-white/90 whitespace-pre-wrap'>{content}</span>
                    ) : (
                        <>
                            <Image src={assets.logo_icon} alt='AI' className='h-8 w-8 p-1 border border-white/20 rounded-full flex-shrink-0 mt-1' />
                            <div className='w-full overflow-x-auto text-gray-200 text-sm leading-normal'>
                                <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;