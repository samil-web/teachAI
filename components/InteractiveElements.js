"use client";

import { useState } from "react";
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  BeakerIcon,
  CalculatorIcon
} from "@heroicons/react/24/outline";

// Interactive Graph Manipulator for Math/Physics
export function GraphManipulator({ title, description, onInteraction }) {
  const [value, setValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleSliderChange = (newValue) => {
    setValue(newValue);
    onInteraction && onInteraction({ type: 'value_change', value: newValue });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">{title}</h3>
      </div>
      
      <p className="text-blue-800 text-sm mb-4">{description}</p>
      
      {/* Interactive Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-blue-700 min-w-[80px]">
            Value:
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={value}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-mono text-blue-800 min-w-[60px]">
            {value.toFixed(1)}
          </span>
        </div>
        
        {/* Visual Representation */}
        <div className="bg-white border border-blue-200 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600 text-sm">
              Interactive graph would appear here
            </p>
            <p className="text-blue-600 font-mono text-lg mt-2">
              f({value.toFixed(1)}) = {(value * value).toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-sm btn-primary"
          >
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Animate'}
          </button>
          <button
            onClick={() => setValue(0)}
            className="btn btn-sm btn-outline"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// Chemistry Molecule Builder
export function MoleculeBuilder({ title, description, onInteraction }) {
  const [selectedAtom, setSelectedAtom] = useState('C');
  const [bonds, setBonds] = useState([]);
  
  const atoms = ['C', 'H', 'O', 'N'];
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <BeakerIcon className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-green-900">{title}</h3>
      </div>
      
      <p className="text-green-800 text-sm mb-4">{description}</p>
      
      {/* Atom Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-green-700 block mb-2">
          Select Atom:
        </label>
        <div className="flex gap-2">
          {atoms.map(atom => (
            <button
              key={atom}
              onClick={() => setSelectedAtom(atom)}
              className={`w-12 h-12 rounded-full border-2 font-bold ${
                selectedAtom === atom
                  ? 'bg-green-500 text-white border-green-600'
                  : 'bg-white text-green-700 border-green-300 hover:border-green-400'
              }`}
            >
              {atom}
            </button>
          ))}
        </div>
      </div>
      
      {/* Molecule Canvas */}
      <div className="bg-white border border-green-200 rounded-lg p-4 h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🧪</div>
          <p className="text-gray-600 text-sm">
            3D molecule builder would appear here
          </p>
          <p className="text-green-600 text-sm mt-2">
            Selected: {selectedAtom} atom
          </p>
        </div>
      </div>
    </div>
  );
}

// Physics Motion Simulator
export function MotionSimulator({ title, description, onInteraction }) {
  const [velocity, setVelocity] = useState(5);
  const [acceleration, setAcceleration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">{title}</h3>
      </div>
      
      <p className="text-purple-800 text-sm mb-4">{description}</p>
      
      {/* Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-purple-700 block mb-1">
              Velocity: {velocity} m/s
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={velocity}
              onChange={(e) => setVelocity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-purple-700 block mb-1">
              Acceleration: {acceleration} m/s²
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              value={acceleration}
              onChange={(e) => setAcceleration(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Simulation Display */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 h-32">
          <div className="flex items-center justify-between h-full">
            <div className="text-center">
              <div className="text-2xl">🚗</div>
              <p className="text-xs text-purple-600">Object</p>
            </div>
            <div className="flex-1 mx-4 border-t-2 border-dashed border-purple-300 relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/2">
                <div className="text-lg">🏁</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-700">v = {velocity} m/s</p>
              <p className="text-sm text-purple-700">a = {acceleration} m/s²</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="btn btn-primary btn-sm"
        >
          {isRunning ? 'Stop' : 'Start'} Simulation
        </button>
      </div>
    </div>
  );
}

// Generic Interactive Component Renderer
export function InteractiveComponent({ interactive, onInteraction }) {
  const { type, title, description } = interactive;
  
  switch (type) {
    case 'graph_manipulator':
      return (
        <GraphManipulator 
          title={title} 
          description={description} 
          onInteraction={onInteraction}
        />
      );
    case 'molecule_builder':
      return (
        <MoleculeBuilder 
          title={title} 
          description={description} 
          onInteraction={onInteraction}
        />
      );
    case 'motion_simulator':
      return (
        <MotionSimulator 
          title={title} 
          description={description} 
          onInteraction={onInteraction}
        />
      );
    default:
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex items-center gap-2 mb-4">
            <CalculatorIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-700 text-sm mb-4">{description}</p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Interactive component placeholder</p>
          </div>
        </div>
      );
  }
}
