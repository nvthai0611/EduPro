import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const renderID = Cookies.get("render_id");
  const userDecoded = jwtDecode(renderID);

  const imageUrl = userDecoded.image;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={imageUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full border shadow-md object-cover"
          />
          <h1 className="text-2xl font-bold mt-4">{userDecoded.userId}</h1>
          <p className="text-gray-500 capitalize">{userDecoded.role}</p>
        </div>

        {/* Information */}
        <div className="mt-8 space-y-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-semibold text-gray-600">User ID</p>
            <p className="text-gray-800">{userDecoded.userId}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-sm font-semibold text-gray-600">Role</p>
            <p className="text-gray-800 capitalize">{userDecoded.role}</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={imageUrl}
              alt="avatar"
              className="w-32 h-32 rounded-full border shadow-md object-cover mx-auto"
            />
            <h1 className="text-2xl font-bold mt-4">{userDecoded.userId}</h1>
            <p className="text-gray-500 capitalize">{userDecoded.role}</p>
          </div>
        </div>

        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
