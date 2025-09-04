import React from 'react';
import AchievementsSection from '../components/AchievementsSection'; // Import AchievementsSection

const Profile: React.FC = () => {
  return (
    <div className="space-y-8"> {/* Added space-y-8 for spacing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Achievements Section */}
      <AchievementsSection />
    </div>
  );
};

export default Profile;
