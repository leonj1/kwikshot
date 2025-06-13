# Screen Recording Troubleshooting Guide

## 🔍 **Issue Analysis**

The "Screen recording is not supported" error occurs because **Electron's renderer process doesn't have access to `navigator.mediaDevices.getDisplayMedia()` by default**. This is a security restriction that requires specific configuration.

## 🛠️ **Step-by-Step Debugging**

### 1. **Check Browser Compatibility**

The enhanced debug component now shows detailed information about:
- Navigator API availability
- MediaDevices API availability  
- getDisplayMedia API availability
- MediaRecorder API availability
- Electron version and Chrome version

### 2. **Verify Electron Configuration**

I've updated the main process (`src/main/index.ts`) to include:
- Permission request handler for media permissions
- Display media request handler (Electron 20+)
- Proper desktop capturer integration

### 3. **Test the Enhanced Debug Component**

The updated `RecordingTest` component now provides comprehensive debugging information:

```typescript
// Enhanced debugging information
const debugInfo = {
  hasNavigator: typeof navigator !== 'undefined',
  hasMediaDevices: typeof navigator?.mediaDevices !== 'undefined',
  hasGetDisplayMedia: typeof navigator?.mediaDevices?.getDisplayMedia !== 'undefined',
  hasGetUserMedia: typeof navigator?.mediaDevices?.getUserMedia !== 'undefined',
  hasMediaRecorder: typeof MediaRecorder !== 'undefined',
  userAgent: navigator?.userAgent || 'Unknown',
  isElectron: typeof window !== 'undefined' && window.process?.type === 'renderer',
  electronVersion: window.process?.versions?.electron || 'Not Electron',
  chromeVersion: window.process?.versions?.chrome || 'Unknown',
};
```

## ✅ **Solutions Implemented**

### 1. **Main Process Permissions** (Primary Solution)

Updated `src/main/index.ts` to include:

```typescript
// Set up session permissions for screen capture
session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
  if (permission === 'media') {
    // Allow media permissions for screen recording
    callback(true);
  } else {
    callback(false);
  }
});

// Handle display media permissions (Electron 20+)
if (session.defaultSession.setDisplayMediaRequestHandler) {
  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    // Allow all display media requests - grant access to primary display
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      if (sources.length > 0) {
        callback({ video: sources[0], audio: 'loopback' });
      } else {
        callback({});
      }
    });
  });
}
```

### 2. **Enhanced Debug Information**

Updated `RecordingTest.tsx` to show:
- All API availability checks
- Electron version information
- Chrome version information
- Detailed capability detection

## 🔧 **Alternative Solutions**

If the primary solution doesn't work, try these alternatives:

### Option 1: **Enable Web Security (Development Only)**

Add to `webPreferences` in `src/main/index.ts`:
```typescript
webPreferences: {
  // ... existing preferences
  webSecurity: false, // ONLY for development
}
```

⚠️ **Warning**: Only use this in development, never in production.

### Option 2: **Use Electron's desktopCapturer API**

Create a custom implementation using Electron's native API:

```typescript
// In preload script
const { desktopCapturer } = require('electron');

// Custom getDisplayMedia implementation
async function getElectronDisplayMedia() {
  const sources = await desktopCapturer.getSources({ 
    types: ['screen', 'window'] 
  });
  
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sources[0].id,
      }
    }
  };
  
  return navigator.mediaDevices.getUserMedia(constraints);
}
```

### Option 3: **System Permissions Check**

On macOS, ensure screen recording permissions are granted:

```typescript
// Check macOS screen recording permissions
if (process.platform === 'darwin') {
  const { systemPreferences } = require('electron');
  
  const hasPermission = systemPreferences.getMediaAccessStatus('screen');
  if (hasPermission !== 'granted') {
    systemPreferences.askForMediaAccess('screen');
  }
}
```

## 🧪 **Testing Steps**

1. **Restart the Application**
   ```bash
   npm run dev
   ```

2. **Check Debug Information**
   - Look at the "Debug Information" section in the test component
   - Verify all APIs show ✓ (checkmarks)

3. **Test Screen Recording**
   - Click "Start 10s Test Recording"
   - Grant permissions when prompted
   - Verify recording works

4. **Check Console Logs**
   - Open Developer Tools (Cmd/Ctrl + Shift + I)
   - Look for any error messages
   - Check if `getDisplayMedia` is available

## 🔍 **Common Issues & Solutions**

### Issue 1: "getDisplayMedia is undefined"
**Solution**: The main process permissions aren't set up correctly. Restart the app after the main process changes.

### Issue 2: "Permission denied"
**Solution**: 
- On macOS: Go to System Preferences > Security & Privacy > Screen Recording and enable the app
- On Windows: Ensure the app has screen capture permissions

### Issue 3: "No supported video formats"
**Solution**: The MediaRecorder API isn't available. Check if running in a secure context.

### Issue 4: "MediaDevices is undefined"
**Solution**: The navigator.mediaDevices API isn't available. This usually means the context isn't secure or Electron permissions aren't set up.

## 📋 **Verification Checklist**

- [ ] Electron app restarted after main process changes
- [ ] Debug component shows all APIs as available (✓)
- [ ] System permissions granted (macOS/Windows)
- [ ] No console errors in Developer Tools
- [ ] Test recording button is enabled
- [ ] Recording actually captures screen content

## 🚀 **Next Steps**

1. **Test the current implementation** with the enhanced debugging
2. **Check the debug output** to see which specific API is missing
3. **Apply the appropriate solution** based on the debug information
4. **Verify screen recording works** end-to-end

The enhanced debug component will help identify exactly what's missing and guide you to the right solution!

---

*This troubleshooting guide was created using AugmentCode tool. For more help, visit www.augmentcode.com community.*
