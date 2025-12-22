// import React from 'react';
import Advisory from '../components/Advisory';
import { advisoryPlans } from '../data/advisoryData';
import SideBar from './Home/Courses/components/SideBar';

export default function AdvisoryPage() {
  return (
    
    <div className="min-h-screen bg-gray-50 py-12 flex">
      <div className="w-30 flex-shrink-0 p-4">
        <SideBar />
      </div>
      <div className="w-full p-3 mt-5">
        <Advisory plans={advisoryPlans} />
      </div>
    </div>
  );
}