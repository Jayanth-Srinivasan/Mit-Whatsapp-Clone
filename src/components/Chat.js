import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { Modal } from 'antd';
import { AvatarGenerator } from 'random-avatar-generator';

import { arrayUnion, doc, setDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

function Chat({ user }) {
    const generator = new AvatarGenerator();
    const onSignout = () => {
        signOut(auth).then(() => {
            alert('Signout Successful');
            localStorage.removeItem('user');
            window.location.reload();
        }).catch((error) => {
            alert(error.message);
        })
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [chatName, setChatName] = useState('');
    const [chatIdInput, setChatIdInput] = useState('');
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState('');
    const [chatInput, setChatInput] = useState('');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        createChat();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal1 = () => {
        setIsModalOpen1(true);
    };
    const handleOk1 = () => {
        setIsModalOpen1(false);
        joinChat();
    };
    const handleCancel1 = () => {
        setIsModalOpen1(false);
    };
    const generateRandomChatId = async () => {
        const min = 10000;
        const max = 99999;
        const rand = min + Math.random() * (max - min);

        const collectionRef = collection(db, 'chats');
        const q = await getDocs(collectionRef);
        const ids = q.docs.map((doc) => doc.id);
        if (ids.includes(Math.round(rand).toString())) {
            generateRandomChatId();
        }
        return Math.round(rand).toString();

    }
    const joinChat = () => {
        updateDoc(doc(db, 'chats', chatIdInput), {
            members: arrayUnion(user.uid)
        }).then(() => {
            alert('Chat Joined');
        }).catch((error) => {
            alert(error.message);
        }
        )
    }
    const createChat = async () => {
        const chatId = await generateRandomChatId();
        console.log(chatId);
        setDoc(doc(db, 'chats', chatId), {
            name: chatName,
            createdBy: user.uid,
            admin: user.name,
            members: [user.uid],
            createdAt: new Date().toISOString(),
            profile: generator.generateRandomAvatar()

        }).then(() => {
            alert(`Chat Created share this code to invite members : ${chatId} `);

        }).catch((error) => {
            alert(error.message);
        })
    }
    const chatSend = () => {
        if (chatInput === '') {
            alert('Please Enter a Message');
        }
        else {
            console.log(chatId);
            updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    message: chatInput,
                    sender: user.uid,
                    senderName: user.name,
                    senderProfile: user.photo,
                })
            }).then(() => {
                setChatInput('');
            }).catch((error) => {
                alert(error.message);
            })
        }
    }
    useEffect(() => {

        const q = query(collection(db, "chats"), where("members", "array-contains", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats = [];
            querySnapshot.forEach((doc) => {
                chats.push({ id: doc.id, ...doc.data() });
            });
            setChats(chats);
            console.log(chats);
        });
        return () => unsubscribe();
    }, [])
    return (
        <section className='flex h-screen bg-[#191919] text-stone-300 w-full'>
            <>
                <Modal title="Create Chat" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div>
                        <input type="text" onChange={(e) => setChatName(e.target.value)} placeholder='Enter Chat Name' className='border-2 rounded-md p-2 w-full border-black ' />
                        {/* <button onClick={createChat} className='hover:bg-blue-400 border-black border-2 rounded-md p-2 w-full mt-4 font-semibold text-base'>Create Chat</button> */}
                    </div>

                </Modal>
                <Modal title="Create Chat" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}>
                    <div>
                        <input type="text" onChange={(e) => setChatIdInput(e.target.value)} placeholder='Enter Chat Name' className='border-2 rounded-md p-2 w-full border-black ' />
                        {/* <button onClick={createChat} className='hover:bg-blue-400 border-black border-2 rounded-md p-2 w-full mt-4 font-semibold text-base'>Create Chat</button> */}
                    </div>

                </Modal>


                <div className={`${chatId === "" ? "block w-full md:w-1/3" : "hidden md:block md:w-1/3"} border-r-2 border-slate-400/50`}>
                    <div className='p-4'>
                        <div className='flex justify-between border-b-2 border-slate-400/20 p-2'>
                            <img onClick={onSignout} referrerPolicy='no-referrer' src={user.photo} alt="" className='w-12 h-12 rounded-full cursor-pointer' />
                            <div>
                                <button onClick={showModal} className='mr-2 border py-1 px-2 rounded-md'>Add Chat</button>
                                <button onClick={showModal1} className='mr-2 border py-1 px-2 rounded-md'>Join Chat</button>
                            </div>
                        </div>
                        <div className='mt-4 flex flex-col gap-4 '>
                            {chats.map((chat,index) => (
                                
                                <div onClick={() => setChatId(chat.id)} key={chat.id} className='flex gap-2 justify-between items-center'>
        
                                    <div className='flex gap-4 items-center'>
                                        <img src={chat.profile} alt="" className='w-12 h-12 rounded-full' />
                                        <div className=''>
                                            <h1 className='text-lg font-semibold'>{chat.name}</h1>
                                            <p className='text-md font-medium'>{chat.messages && chat?.messages[chat?.messages?.length - 1].message}</p>
                                        </div>
                                    </div>
                                    {/* <div>
                                        <time className='font-mono'>10:00</time>
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
            <div className={` ${chatId === "" ? 'hidden' : 'block w-full md:w-2/3'} p-4 `}>{
                chatId === '' ? <h1 className='text-2xl font-semibold'>Select a Chat to Start Messaging</h1> : (
                    <>
                        {
                            chats
                                .filter((chat) => chat.id === chatId)
                                .map((chat) => (
                                    <>
                                        <div className='p-2 flex justify-between items-center border-b-2 border-slate-400/30 '>

                                            <div className='flex items-center gap-8'>
                                                <svg onClick={() => setChatId("")} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 md:hidden block cursor-pointer">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                                </svg>
                                                <img  src={chat.profile} alt="" className='w-12 h-12 rounded-full ' />

                                                <h1 className='text-xl font-semibold'>{chat.name}</h1>
                                            </div>
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>

                                            </div>

                                        </div>
                                        <div className='h-4/5 mt-4 '>
                                            <div className='flex flex-col flex-grow bg-gray-800 w-full h-full shadow-xl rounded-lg overflow-hidden'>
                                                <div className='flex flex-col flex-grow h-0 p-4 overflow-auto'>
                                                    {
                                                        chat.messages?.map((message) => (
                                                            <>
                                                                {
                                                                    message.sender === user.uid ? (
                                                                        <div className='flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end items-center'>
                                                                            <div className='p-3 bg-green-600/50 rounded-r-lg rounded-bl-lg'>
                                                                                <p className='text-sm'>{message.message}</p>
            
                                                                            </div>
                                                                            <img src={message.senderProfile} alt="" className='w-8 h-8 rounded-full' />

                                                                        </div>
                                                                    ) : (
                                                                            <div className='flex w-full mt-2 space-x-3 max-w-xs items-center'>
                                                                                <img src={message.senderProfile} alt="" className='w-8 h-8 rounded-full' />
                                                                            <div className='p-3 bg-blue-600/50 rounded-r-lg rounded-bl-lg'>
                                                                                <p className='text-sm'>{message.message}</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                        }
                        <div className='mt-2'>
                            <div className='flex items-center gap-1'>
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder='Enter Your Message Here ...' className='w-full h-12 rounded-lg bg-gray-500 p-4' />
                                <svg onClick={chatSend} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>

                            </div>
                        </div>
                    </>
                )
            }
            </div>
        </section>
    )
}

export default Chat