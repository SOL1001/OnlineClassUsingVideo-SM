const Notifications = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <p className="text-lg">You have no new notifications.</p>
      </div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification List</h2>
          <ul className="list-disc pl-5">
            <li>No notifications available.</li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <p className="text-gray-700">
            You can manage your notification settings here.
          </p>
        </div>
      </div>
    </>
  );
};

export default Notifications;
