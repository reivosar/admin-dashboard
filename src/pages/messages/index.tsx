import Messanger from "@/components/messages/Messanger";

const MessagesPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
      </div>
      <Messanger />
    </div>
  );
};

export default MessagesPage;
