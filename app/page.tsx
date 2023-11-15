'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ChatMessage from '../components/ChatMessage';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { VscSend } from "react-icons/vsc";
import { GoPeople } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { BiMessageX } from "react-icons/bi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { FiVideo } from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";

interface Chat {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}


const groupChatsByDate = (chats: Chat[]) => {
  const groupedChats: { [date: string]: Chat[] } = {};

  chats.forEach((chat) => {
    const date = chat.time.split(' ')[0]; // Extract the date part

    if (!groupedChats[date]) {
      groupedChats[date] = [];
    }

    // Sort chats by time before pushing
    groupedChats[date].push(chat);
    groupedChats[date].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  });

  return groupedChats;
};

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0); // Track the current page for infinite scroll
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://qa.corider.in/assignment/chat?page=${page}`);
        const newData: Chat[] = response.data.chats;

        setChats((prevChats) => [...prevChats, ...newData]);
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]); // Trigger the effect when the page changes

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    if (scrollHeight - scrollTop === clientHeight && !isLoading) {
      // User has scrolled to the bottom, load more data
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Attach a scroll event listener to the document to handle infinite scroll
    document.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);
  const groupedChats = groupChatsByDate(chats);

  const handleMenuToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleTabToggle = () => {
    setIsTabOpen((prevIsTabOpen) => !prevIsTabOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleTabClose = () => {
    setIsTabOpen(false);
  };


  const handleDocumentClick = (event: MouseEvent) => {
    // Close the menu if it is open and the click is not within the menu
    if (isMenuOpen && menuRef.current && !(menuRef.current.contains(event.target as Node))) {
      handleMenuClose();
    }

    // Close the tab if it is open and the click is not within the tab
    if (isTabOpen && tabRef.current && !(tabRef.current.contains(event.target as Node))) {
      handleTabClose();
    }
  };

  useEffect(() => {
    // Attach a click event listener to the document to handle clicks anywhere on the screen
    document.addEventListener('click', handleDocumentClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isMenuOpen, isTabOpen]);

  return (
    <div className="container mx-auto p-4" >

      <div className='fixed w-full border-b p-4 top-0 left-0 z-40 bg-primaryColor ' >
        <div className='flex items-center justify-between' >
          <div className='flex items-center gap-2 font-semibold text-xl' >
            <FaArrowLeft />
            Trip 1
          </div>
          <FiEdit />
        </div>

        <div className='flex items-center pt-3 justify-between' >
          <div className='flex gap-4 items-center ' >
            <img className='rounded-full h-14' src="/trip.jpeg" alt="trip" />
            <div>
              <p className='text-[#606060] font-normal' >
                From <span className='text-[#141E0D] text-lg font-semibold ' >IGI Airport, T3</span>
              </p>
              <p className='text-[#606060] font-normal' >
                To <span className='text-[#141E0D] text-lg font-semibold ' >Sector 28</span>
              </p>
            </div>
          </div>

          <div className='relative'>
            <BsThreeDotsVertical size={25} onClick={handleMenuToggle} />
            {isMenuOpen && (
              <div ref={menuRef} className='absolute bg-white border rounded-lg shadow-xl z-50 top-8 right-0 transition-all duration-300 ease-in-out '>
                <div className='flex flex-row items-center border-b p-3 gap-2'>
                  <GoPeople size={18} />
                  <p className='text-xs'>Members</p>
                </div>
                <div className='flex flex-row items-center border-b px-3 py-2 gap-2'>
                  <IoCallOutline size={18} />
                  <p className='text-xs whitespace-nowrap'>Share Number</p>
                </div>
                <div className='flex flex-row items-center px-3 py-2 gap-2'>
                  <BiMessageX size={18} />
                  <p className='text-xs'>Report</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='h-32' />


      {Object.entries(groupedChats).map(([date, chatsOnDate]) => (
        <div key={date} className="mb-4 ">
          <div className='relative h-10' >
            <div className="relative z-10 flex items-center justify-center  ">
              <p className='w-fit text-[#B7B7B7] text-xs bg-primaryColor px-2 ' >
                {date}
              </p>
            </div>
            <div className="absolute w-full h-[1px] bg-[#B7B7B7] top-[7px]"></div>
          </div>
          {chatsOnDate.map((chat) => (
            <ChatMessage key={chat.id} {...chat} />
          ))}
        </div>
      ))}

      <div className='h-8' />

      <div className='fixed w-full bottom-0 bg-[#FAF9F4] left-0 px-4 py-2' >
        <div className='bg-white px-3 py-2 rounded-lg  flex items-center justify-between' >
          <input className='text-[#B7B7B7] text-xs focus:outline-none ' type="text" placeholder='Reply to @Rohit Yadav' />
          <div className='flex flex-row gap-4' >
            <div className='relative' >
              {isTabOpen &&
                <div ref={tabRef} className='absolute bottom-9 -left-12 rounded-full bg-[#008000] flex flex-row gap-3 px-4 py-3 text-white transition-all duration-300 ease-in-out ' >
                  <MdOutlineCameraAlt size={19} />
                  <FiVideo size={19} />
                  <CgFileDocument size={19} />
                  <img className='absolute -bottom-1.5 left-[54px]  ' src="/Corner.svg" alt="corner" />
                </div>
              }

              <FiPaperclip onClick={handleTabToggle} size={20} />
            </div>
            <VscSend size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;