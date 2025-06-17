import React, { useState } from 'react';
import { X, Plus, Calendar, ChevronDown } from 'lucide-react';

const TaskCreationForm = ({ onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    tags: [],
    isRecurring: false
  });
  const [newTag, setNewTag] = useState('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const tabs = ['Details', 'Assignment', 'Attachments'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    console.log('Task created:', formData);
    if (onCreate) onCreate(formData);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
            <p className="text-gray-600 text-sm mt-1">Create a new task and assign it to team members</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6">
          {activeTab === 'Details' && (
            <div className="space-y-6">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter task description..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500"
                  >
                    <span className={formData.priority ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.priority || 'Select priority'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {priorities.map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => {
                            handleInputChange('priority', priority);
                            setShowPriorityDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Recurring */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Recurring Task</label>
              </div>
            </div>
          )}

          {activeTab === 'Assignment' && (
            <div className="text-center py-12 text-gray-500">Assignment features coming soon</div>
          )}
          {activeTab === 'Attachments' && (
            <div className="text-center py-12 text-gray-500">Attachment features coming soon</div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationForm;
