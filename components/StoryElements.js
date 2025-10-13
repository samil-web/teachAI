"use client";

import { useState } from "react";
import { 
  BookOpenIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  MegaphoneIcon,
  HeartIcon
} from "@heroicons/react/24/outline";

// Interactive Story Builder
export function StoryBuilder({ title, description, storyPrompt, onStoryUpdate }) {
  const [currentStory, setCurrentStory] = useState(storyPrompt || "");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  
  const characters = [
    { name: "Hero", emoji: "🦸", description: "The brave protagonist" },
    { name: "Mentor", emoji: "👨‍🏫", description: "The wise guide" },
    { name: "Challenger", emoji: "🤔", description: "The questioning voice" },
    { name: "Friend", emoji: "👫", description: "The supportive ally" }
  ];
  
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpenIcon className="w-5 h-5 text-amber-600" />
        <h3 className="font-semibold text-amber-900">{title}</h3>
      </div>
      
      <p className="text-amber-800 text-sm mb-4">{description}</p>
      
      {/* Character Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-amber-700 block mb-2">
          Choose Your Character Perspective:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {characters.map(character => (
            <button
              key={character.name}
              onClick={() => setSelectedCharacter(character.name)}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                selectedCharacter === character.name
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-amber-700 border-amber-300 hover:border-amber-400'
              }`}
            >
              <div className="text-2xl mb-1">{character.emoji}</div>
              <div className="text-xs font-medium">{character.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Story Canvas */}
      <div className="bg-white border border-amber-200 rounded-lg p-4">
        <textarea
          value={currentStory}
          onChange={(e) => {
            setCurrentStory(e.target.value);
            onStoryUpdate && onStoryUpdate(e.target.value);
          }}
          placeholder="Continue the story from your character's perspective..."
          className="w-full h-32 p-3 border border-amber-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        
        {selectedCharacter && (
          <div className="mt-3 p-2 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-700">
              <strong>Writing as {selectedCharacter}:</strong> {characters.find(c => c.name === selectedCharacter)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Role-Playing Scenario
export function RolePlayScenario({ title, description, scenario, roles }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [responses, setResponses] = useState({});
  
  const handleResponseChange = (role, response) => {
    setResponses(prev => ({
      ...prev,
      [role]: response
    }));
  };
  
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <UserGroupIcon className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">{title}</h3>
      </div>
      
      <p className="text-emerald-800 text-sm mb-4">{description}</p>
      
      {/* Scenario Setup */}
      <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-emerald-900 mb-2">Scenario:</h4>
        <p className="text-emerald-800 text-sm leading-relaxed">{scenario}</p>
      </div>
      
      {/* Role Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-emerald-700 block mb-2">
          Available Roles:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles?.map((role, index) => (
            <button
              key={index}
              onClick={() => setSelectedRole(role.name)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                selectedRole === role.name
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-400'
              }`}
            >
              <div className="font-medium">{role.name}</div>
              <div className="text-sm opacity-90">{role.description}</div>
            </button>
          )) || (
            <div className="col-span-2 text-center text-emerald-600 text-sm">
              No specific roles defined - students can create their own!
            </div>
          )}
        </div>
      </div>
      
      {/* Response Area */}
      {selectedRole && (
        <div className="bg-white border border-emerald-200 rounded-lg p-4">
          <h4 className="font-medium text-emerald-900 mb-2">
            Your Response as {selectedRole}:
          </h4>
          <textarea
            value={responses[selectedRole] || ""}
            onChange={(e) => handleResponseChange(selectedRole, e.target.value)}
            placeholder={`How would ${selectedRole} respond to this situation?`}
            className="w-full h-24 p-3 border border-emerald-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}
    </div>
  );
}

// Historical Timeline Explorer
export function TimelineExplorer({ title, description, events, onEventSelect }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [personalConnection, setPersonalConnection] = useState("");
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">{title}</h3>
      </div>
      
      <p className="text-blue-800 text-sm mb-4">{description}</p>
      
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
        
        <div className="space-y-4">
          {events?.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">
                {index + 1}
              </div>
              
              <button
                onClick={() => {
                  setSelectedEvent(event);
                  onEventSelect && onEventSelect(event);
                }}
                className={`flex-1 text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedEvent?.title === event.title
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-white text-blue-700 border-blue-300 hover:border-blue-400'
                }`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm opacity-90">{event.date}</div>
                <div className="text-sm mt-1">{event.description}</div>
              </button>
            </div>
          )) || (
            <div className="text-center text-blue-600 text-sm py-8">
              Timeline events would be loaded here based on the lesson topic
            </div>
          )}
        </div>
      </div>
      
      {/* Personal Connection */}
      {selectedEvent && (
        <div className="mt-6 bg-white border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Personal Connection to "{selectedEvent.title}":
          </h4>
          <textarea
            value={personalConnection}
            onChange={(e) => setPersonalConnection(e.target.value)}
            placeholder="How does this event connect to your life or community? What questions do you have?"
            className="w-full h-20 p-3 border border-blue-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

// Collaborative Discussion Board
export function DiscussionBoard({ title, description, prompt, onResponseAdd }) {
  const [newResponse, setNewResponse] = useState("");
  const [responses, setResponses] = useState([]);
  
  const addResponse = () => {
    if (newResponse.trim()) {
      const response = {
        id: Date.now(),
        text: newResponse,
        author: "Student",
        timestamp: new Date().toLocaleTimeString()
      };
      setResponses(prev => [...prev, response]);
      setNewResponse("");
      onResponseAdd && onResponseAdd(response);
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">{title}</h3>
      </div>
      
      <p className="text-purple-800 text-sm mb-4">{description}</p>
      
      {/* Discussion Prompt */}
      <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-purple-900 mb-2">Discussion Prompt:</h4>
        <p className="text-purple-800 text-sm leading-relaxed">{prompt}</p>
      </div>
      
      {/* Response Input */}
      <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
        <textarea
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Share your thoughts, questions, or connections..."
          className="w-full h-20 p-3 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={addResponse}
          disabled={!newResponse.trim()}
          className="mt-2 btn btn-primary btn-sm"
        >
          Add Response
        </button>
      </div>
      
      {/* Responses */}
      <div className="space-y-3">
        {responses.map(response => (
          <div key={response.id} className="bg-white border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <HeartIcon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">{response.author}</span>
              <span className="text-xs text-purple-500">{response.timestamp}</span>
            </div>
            <p className="text-purple-800 text-sm">{response.text}</p>
          </div>
        ))}
        
        {responses.length === 0 && (
          <div className="text-center text-purple-600 text-sm py-4">
            Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}

// Generic Story Component Renderer
export function StoryComponent({ narrative, onInteraction }) {
  const { type, title, description } = narrative;
  
  switch (type) {
    case 'story_builder':
      return (
        <StoryBuilder 
          title={title} 
          description={description}
          storyPrompt="Once upon a time..."
          onStoryUpdate={onInteraction}
        />
      );
    case 'role_play':
      return (
        <RolePlayScenario 
          title={title} 
          description={description}
          scenario="You find yourself in a challenging situation..."
          roles={[
            { name: "Leader", description: "Takes charge and makes decisions" },
            { name: "Mediator", description: "Helps resolve conflicts" },
            { name: "Observer", description: "Watches and analyzes the situation" }
          ]}
        />
      );
    case 'timeline_explorer':
      return (
        <TimelineExplorer 
          title={title} 
          description={description}
          events={[
            { title: "Event 1", date: "Date", description: "Description of what happened" },
            { title: "Event 2", date: "Date", description: "Description of what happened" }
          ]}
          onEventSelect={onInteraction}
        />
      );
    case 'discussion_board':
      return (
        <DiscussionBoard 
          title={title} 
          description={description}
          prompt="What are your thoughts on this topic?"
          onResponseAdd={onInteraction}
        />
      );
    default:
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex items-center gap-2 mb-4">
            <MegaphoneIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-700 text-sm mb-4">{description}</p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Story-based component placeholder</p>
          </div>
        </div>
      );
  }
}
