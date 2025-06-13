import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Keyboard,
  Edit3,
  Check,
  X,
  RotateCcw,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { ShortcutSettings } from '../../../shared/types';

interface ShortcutItemProps {
  label: string;
  description: string;
  shortcut: string;
  onUpdate: (newShortcut: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  existingShortcuts: string[];
  shortcutKey: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({
  label,
  description,
  shortcut,
  onUpdate,
  isEditing,
  onEdit,
  onCancel,
  existingShortcuts,
  shortcutKey,
}) => {
  const [newShortcut, setNewShortcut] = useState(shortcut);
  const [isRecording, setIsRecording] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recordingKeys, setRecordingKeys] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLDivElement>(null);

  // Reset state when editing changes
  useEffect(() => {
    if (!isEditing) {
      setNewShortcut(shortcut);
      setIsRecording(false);
      setValidationError(null);
      setRecordingKeys(new Set());
    }
  }, [isEditing, shortcut]);

  // Focus input when starting to record
  useEffect(() => {
    if (isRecording && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRecording]);

  const normalizeKey = (key: string): string => {
    // Normalize key names for consistency
    const keyMap: Record<string, string> = {
      ' ': 'Space',
      'ArrowUp': 'Up',
      'ArrowDown': 'Down',
      'ArrowLeft': 'Left',
      'ArrowRight': 'Right',
      'Escape': 'Esc',
      'Delete': 'Del',
      'Backspace': 'Backspace',
      'Enter': 'Return',
      'Tab': 'Tab',
    };

    return keyMap[key] || key.toUpperCase();
  };

  const formatShortcut = (keys: Set<string>): string => {
    const modifiers: string[] = [];
    const regularKeys: string[] = [];

    // Separate modifiers from regular keys
    keys.forEach(key => {
      if (['CMD', 'CTRL', 'ALT', 'SHIFT'].includes(key)) {
        modifiers.push(key);
      } else {
        regularKeys.push(key);
      }
    });

    // Order modifiers consistently: Cmd/Ctrl, Alt, Shift
    const orderedModifiers: string[] = [];
    if (modifiers.includes('CMD')) orderedModifiers.push('Cmd');
    if (modifiers.includes('CTRL')) orderedModifiers.push('Ctrl');
    if (modifiers.includes('ALT')) orderedModifiers.push('Alt');
    if (modifiers.includes('SHIFT')) orderedModifiers.push('Shift');

    return [...orderedModifiers, ...regularKeys].join('+');
  };

  const validateShortcut = (shortcutString: string): string | null => {
    if (!shortcutString || shortcutString.length === 0) {
      return 'Shortcut cannot be empty';
    }

    // Check if it's just modifier keys
    const parts = shortcutString.split('+');
    const hasRegularKey = parts.some(part =>
      !['Cmd', 'Ctrl', 'Alt', 'Shift'].includes(part)
    );

    if (!hasRegularKey) {
      return 'Shortcut must include at least one non-modifier key';
    }

    // Check for conflicts with existing shortcuts (excluding current one)
    const otherShortcuts = existingShortcuts.filter(s => s !== shortcut);
    if (otherShortcuts.includes(shortcutString)) {
      return 'This shortcut is already in use';
    }

    // Check for system shortcuts that shouldn't be overridden
    const systemShortcuts = [
      'Cmd+Q', 'Cmd+W', 'Cmd+T', 'Cmd+A', 'Cmd+C', 'Cmd+V', 'Cmd+X', 'Cmd+Z',
      'Ctrl+Q', 'Ctrl+W', 'Ctrl+T', 'Ctrl+A', 'Ctrl+C', 'Ctrl+V', 'Ctrl+X', 'Ctrl+Z',
      'Alt+F4', 'Alt+Tab'
    ];

    if (systemShortcuts.includes(shortcutString)) {
      return 'Cannot override system shortcuts';
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording) return;

    e.preventDefault();
    e.stopPropagation();

    const key = e.key;
    const newKeys = new Set(recordingKeys);

    // Add modifier keys
    if (e.metaKey) newKeys.add('CMD');
    if (e.ctrlKey) newKeys.add('CTRL');
    if (e.altKey) newKeys.add('ALT');
    if (e.shiftKey) newKeys.add('SHIFT');

    // Add regular key (but not modifier keys themselves)
    if (!['Meta', 'Control', 'Alt', 'Shift'].includes(key)) {
      const normalizedKey = normalizeKey(key);
      newKeys.add(normalizedKey);
    }

    setRecordingKeys(newKeys);

    // If we have at least one modifier and one regular key, complete the recording
    const hasModifier = ['CMD', 'CTRL', 'ALT', 'SHIFT'].some(mod => newKeys.has(mod));
    const hasRegularKey = Array.from(newKeys).some(k =>
      !['CMD', 'CTRL', 'ALT', 'SHIFT'].includes(k)
    );

    if (hasModifier && hasRegularKey) {
      const shortcutString = formatShortcut(newKeys);
      const error = validateShortcut(shortcutString);

      if (error) {
        setValidationError(error);
        // Don't stop recording, let user try again
      } else {
        setNewShortcut(shortcutString);
        setIsRecording(false);
        setValidationError(null);
        setRecordingKeys(new Set());
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!isRecording) return;

    // Clear keys on key up to allow for new combination
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      // If no modifiers are held, clear the recording
      setRecordingKeys(new Set());
    }
  };

  const handleSave = () => {
    const error = validateShortcut(newShortcut);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onUpdate(newShortcut);
    onCancel();
  };

  const handleCancel = () => {
    setNewShortcut(shortcut);
    setIsRecording(false);
    setValidationError(null);
    setRecordingKeys(new Set());
    onCancel();
  };

  const startRecording = () => {
    setIsRecording(true);
    setValidationError(null);
    setRecordingKeys(new Set());
    onEdit();
  };

  const getCurrentDisplayText = (): string => {
    if (isRecording) {
      if (recordingKeys.size === 0) {
        return 'Press keys...';
      }
      return formatShortcut(recordingKeys);
    }
    return newShortcut;
  };

  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1">{label}</h3>
          <p className="text-sm text-gray-400">{description}</p>
          {validationError && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertCircle size={14} className="text-red-400" />
              <p className="text-sm text-red-400">{validationError}</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <div
                ref={inputRef}
                className={`px-3 py-2 rounded-lg border-2 min-w-[140px] text-center transition-all duration-200 ${
                  isRecording
                    ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20'
                    : validationError
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-gray-600 bg-gray-700'
                }`}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                tabIndex={0}
                style={{ outline: 'none' }}
              >
                <span className={`font-mono text-sm ${
                  isRecording
                    ? 'text-blue-300'
                    : validationError
                    ? 'text-red-300'
                    : 'text-white'
                }`}>
                  {getCurrentDisplayText()}
                </span>
              </div>

              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording
                    ? 'text-blue-300 bg-blue-900/30 cursor-not-allowed'
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                }`}
                title="Record new shortcut"
              >
                <Keyboard size={16} />
              </button>

              <button
                onClick={handleSave}
                disabled={isRecording || !!validationError}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording || validationError
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                }`}
                title="Save"
              >
                <Check size={16} />
              </button>

              <button
                onClick={handleCancel}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600">
                <span className="text-white font-mono text-sm">{shortcut}</span>
              </div>

              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit shortcut"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ShortcutsSettings: React.FC = () => {
  const { settings, updateShortcuts } = useSettingsStore();
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const shortcutDefinitions = [
    {
      key: 'startRecording' as keyof ShortcutSettings,
      label: 'Start Recording',
      description: 'Begin a new screen recording session'
    },
    {
      key: 'stopRecording' as keyof ShortcutSettings,
      label: 'Stop Recording',
      description: 'End the current recording session'
    },
    {
      key: 'pauseRecording' as keyof ShortcutSettings,
      label: 'Pause/Resume Recording',
      description: 'Pause or resume the current recording'
    },
    {
      key: 'takeScreenshot' as keyof ShortcutSettings,
      label: 'Take Screenshot',
      description: 'Capture a screenshot'
    },
    {
      key: 'openSettings' as keyof ShortcutSettings,
      label: 'Open Settings',
      description: 'Open the settings window'
    },
    {
      key: 'newProject' as keyof ShortcutSettings,
      label: 'New Project',
      description: 'Create a new video project'
    },
    {
      key: 'saveProject' as keyof ShortcutSettings,
      label: 'Save Project',
      description: 'Save the current project'
    },
    {
      key: 'exportVideo' as keyof ShortcutSettings,
      label: 'Export Video',
      description: 'Export the current project as video'
    },
    {
      key: 'toggleFullscreen' as keyof ShortcutSettings,
      label: 'Toggle Fullscreen',
      description: 'Enter or exit fullscreen mode'
    }
  ];

  // Get all current shortcuts for conflict detection
  const getAllShortcuts = (): string[] => {
    return Object.values(settings.shortcuts);
  };

  const handleShortcutUpdate = async (key: keyof ShortcutSettings, newShortcut: string) => {
    setSaveStatus('saving');
    try {
      updateShortcuts({ [key]: newShortcut });
      setSaveStatus('success');

      // Auto-hide success status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to update shortcut:', error);
      setSaveStatus('error');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('Reset all shortcuts to defaults? This will overwrite all your custom shortcuts.')) {
      setSaveStatus('saving');
      try {
        // Use platform-appropriate defaults
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const cmdKey = isMac ? 'Cmd' : 'Ctrl';

        const defaultShortcuts: ShortcutSettings = {
          startRecording: `${cmdKey}+Shift+R`,
          stopRecording: `${cmdKey}+Shift+S`,
          pauseRecording: `${cmdKey}+Shift+P`,
          resumeRecording: `${cmdKey}+Shift+P`,
          takeScreenshot: isMac ? 'Cmd+Shift+4' : 'Ctrl+Shift+4',
          openSettings: isMac ? 'Cmd+,' : 'Ctrl+,',
          newProject: `${cmdKey}+N`,
          saveProject: `${cmdKey}+S`,
          exportVideo: `${cmdKey}+E`,
          toggleFullscreen: isMac ? 'Cmd+Ctrl+F' : 'F11',
        };

        updateShortcuts(defaultShortcuts);
        setSaveStatus('success');

        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('Failed to reset shortcuts:', error);
        setSaveStatus('error');

        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Keyboard size={24} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-gray-400">Customize keyboard shortcuts for quick actions</p>
            </div>
          </div>
          
          <button
            onClick={resetToDefaults}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset to Defaults</span>
          </button>
        </div>

        {/* Status Banner */}
        {saveStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-xl border ${
            saveStatus === 'success'
              ? 'bg-green-900/20 border-green-500/30'
              : saveStatus === 'error'
              ? 'bg-red-900/20 border-red-500/30'
              : 'bg-blue-900/20 border-blue-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              {saveStatus === 'saving' && (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              )}
              {saveStatus === 'success' && <Check size={20} className="text-green-400" />}
              {saveStatus === 'error' && <AlertCircle size={20} className="text-red-400" />}
              <span className={`font-medium ${
                saveStatus === 'success' ? 'text-green-300' :
                saveStatus === 'error' ? 'text-red-300' : 'text-blue-300'
              }`}>
                {saveStatus === 'saving' && 'Saving shortcuts...'}
                {saveStatus === 'success' && 'Shortcuts saved successfully!'}
                {saveStatus === 'error' && 'Failed to save shortcuts. Please try again.'}
              </span>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-300 mb-1">How to Record Shortcuts</h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Click the <strong>edit button</strong> to modify a shortcut</li>
                <li>• Click the <strong>keyboard icon</strong> to start recording</li>
                <li>• <strong>Hold modifier keys</strong> (Cmd/Ctrl, Alt, Shift) and press a regular key</li>
                <li>• The shortcut will be saved automatically when valid</li>
                <li>• <strong>Conflicts</strong> with existing shortcuts will be detected</li>
                <li>• System shortcuts (Cmd+C, Cmd+V, etc.) cannot be overridden</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-4">
          {shortcutDefinitions.map((def) => (
            <ShortcutItem
              key={def.key}
              label={def.label}
              description={def.description}
              shortcut={settings.shortcuts[def.key]}
              onUpdate={(newShortcut) => handleShortcutUpdate(def.key, newShortcut)}
              isEditing={editingShortcut === def.key}
              onEdit={() => setEditingShortcut(def.key)}
              onCancel={() => setEditingShortcut(null)}
              existingShortcuts={getAllShortcuts()}
              shortcutKey={def.key}
            />
          ))}
        </div>

        {/* Testing Section (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="font-medium text-white mb-4">Shortcut Testing</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong>Current shortcuts:</strong></p>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {shortcutDefinitions.map((def) => (
                  <div key={def.key} className="flex justify-between">
                    <span>{def.label}:</span>
                    <span className="text-blue-400">{settings.shortcuts[def.key]}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Note: Global shortcut registration will be implemented in the main process.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
