import React, { useState } from 'react';
import { X, Plus, Calendar, ChevronDown, Upload } from 'lucide-react';

const TaskCreationForm = ({ onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    tags: [],
    isRecurring: false,
    assignedTeams: [],
    attachments: [],
    instructions: ''
  });
  const [newTag, setNewTag] = useState('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const tabs = ['Details', 'Assignment', 'Attachments'];
  
  // Sample teams data - replace with your actual teams data
  const availableTeams = [
    { id: 1, name: 'Development Team', members: 5, color: 'bg-blue-500' },
    { id: 2, name: 'Design Team', members: 3, color: 'bg-purple-500' },
    { id: 3, name: 'Marketing Team', members: 4, color: 'bg-green-500' },
    { id: 4, name: 'QA Team', members: 2, color: 'bg-orange-500' },
    { id: 5, name: 'Sales Team', members: 6, color: 'bg-red-500' }
  ];

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

  const toggleTeamAssignment = (team) => {
    setFormData(prev => ({
      ...prev,
      assignedTeams: prev.assignedTeams.find(t => t.id === team.id)
        ? prev.assignedTeams.filter(t => t.id !== team.id)
        : [...prev.assignedTeams, team]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <div className="space-y-6">
              {/* Assign to Teams */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Teams
                </label>
                <p className="text-sm text-gray-500 mb-4">Select teams to assign this task to</p>
                
                {/* Selected Teams */}
                {formData.assignedTeams.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Teams ({formData.assignedTeams.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.assignedTeams.map((team) => (
                        <div key={team.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                            <span className="text-sm font-medium text-gray-900">{team.name}</span>
                            <span className="text-xs text-gray-500">({team.members} members)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleTeamAssignment(team)}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTeamsDropdown(!showTeamsDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="text-gray-700">Select teams to assign</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showTeamsDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {availableTeams.map((team) => {
                        const isSelected = formData.assignedTeams.find(t => t.id === team.id);
                        return (
                          <button
                            key={team.id}
                            type="button"
                            onClick={() => toggleTeamAssignment(team)}
                            className={`w-full px-3 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{team.name}</div>
                                <div className="text-xs text-gray-500">{team.members} members</div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Task Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Instructions
                </label>
                <textarea
                  value={formData.instructions || ''}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Provide specific instructions for the assigned teams..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'Attachments' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <p className="text-sm text-gray-500 mb-4">Upload files, documents, or images related to this task</p>
                
                {/* Upload Zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Plus size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, TXT, Images, ZIP (max 10MB each)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Uploaded Files */}
              {formData.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Files ({formData.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-xs text-blue-600 font-medium">
                              {attachment.name.split('.').pop().toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Maximum file size: 10MB per file</li>
                  <li>• Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP, RAR</li>
                  <li>• You can upload multiple files at once</li>
                  <li>• Files will be accessible to all assigned team members</li>
                </ul>
              </div>
            </div>
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