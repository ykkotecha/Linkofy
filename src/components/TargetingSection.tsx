import React, { useState } from 'react';
import { Search, Filter, Save } from 'lucide-react';

export default function TargetingSection() {
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    industry: '',
    company: '',
    experience: 'any',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
          <button className="btn-primary flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Job title, skills, etc."
                value={filters.keywords}
                onChange={(e) => handleFilterChange('keywords', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="City, Country, or Remote"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Technology, Finance"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Company name"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              className="input-field"
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option value="any">Any Experience Level</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid-Senior Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search Profiles</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Filters</h3>
        <div className="space-y-4">
          {['Tech Startups in SF', 'Marketing Directors UK', 'Remote DevOps'].map((filter, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{filter}</h4>
                <p className="text-sm text-gray-500">Last used 2 days ago</p>
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm py-1">Edit</button>
                <button className="btn-primary text-sm py-1">Use</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}