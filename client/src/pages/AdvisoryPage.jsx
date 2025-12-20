// import React from 'react';
import Advisory from '../components/Advisory';
import { advisoryPlans } from '../data/advisoryData';
import SideBar from './Home/Courses/components/SideBar';

export default function AdvisoryPage() {
  return (
    
    <div className="min-h-screen bg-gray-50 py-12 flex">
      <div className="w-28 flex-shrink-0 p-4">
        <SideBar />
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Tư vấn lộ trình học tập</h1>
        <Advisory plans={advisoryPlans} />
      </div>
    </div>
  );
}