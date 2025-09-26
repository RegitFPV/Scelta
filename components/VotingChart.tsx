
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Photo } from '../types';
import type { Vote } from '../types';

interface VotingChartProps {
  photos: Photo[];
  votes: Vote[];
}

const COLORS = ['#4fd1c5', '#63b3ed', '#9f7aea', '#ed8936', '#f56565', '#48bb78'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md">
        <p className="label text-teal-300">{`${label}`}</p>
      </div>
    );
  }

  return null;
};


const VotingChart: React.FC<VotingChartProps> = ({ photos, votes }) => {
  const voteCounts = photos.map(photo => {
    const count = votes.filter(vote => vote.photoId === photo.id).length;
    return { name: photo.title, votes: count };
  });

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-teal-300">Voting Trends</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={voteCounts} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} stroke="#475569" />
            <YAxis tick={{ fill: '#94a3b8' }} stroke="#475569" hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.5)'}}/>
            <Bar dataKey="votes" fill="#8884d8" radius={[4, 4, 0, 0]}>
                 {voteCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VotingChart;
