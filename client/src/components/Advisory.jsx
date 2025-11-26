import React from 'react';
import { Link } from 'react-router-dom';

export default function Advisory({ plans = [] }) {
  if (!plans.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold mb-2">Tư vấn lộ trình</h3>
        <p className="text-gray-500">Hiện chưa có lộ trình. Vui lòng quay lại sau.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">Tư vấn lộ trình</h3>
      <ul className="space-y-4">
        {plans.map(p => (
          <li key={p.id} className="border p-4 rounded-lg">
            <h4 className="font-semibold">{p.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{p.description}</p>
            <ul className="text-sm list-disc list-inside text-gray-700">
              {p.steps.map((s,i) => <li key={i}>{s}</li>)}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <Link to="/contact" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  );
}