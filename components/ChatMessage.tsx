import React from 'react';

interface ChatMessageProps {
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isSelfMessage = sender.self;

  const renderMessage = () => {
    // Safely render HTML using dangerouslySetInnerHTML
    return { __html: message };
  };

  return (
    <div className={`flex text-xs ${isSelfMessage ? 'justify-end' : 'justify-start mr-5'} items-start  space-x-2 mb-4`}>
      {!isSelfMessage && 
      <div className='relative min-w-fit ' >
        <img className='absolute w-3 bottom-0 right-0' src="/check-verified.svg" alt="check" />
        <img className="rounded-full h-8 w-8" src={sender.image} alt={sender.user_id} />
      </div>
      }
      <div
        className={`p-2 shadow-md ${
          isSelfMessage
            ? 'rounded-lg rounded-br-none bg-[#1C63D5] text-white ml-12 '
            : 'rounded-lg rounded-tl-none text-[#606060] bg-white'
        }`}
        dangerouslySetInnerHTML={renderMessage()}
      ></div>
    </div>
  );
};

export default ChatMessage;
