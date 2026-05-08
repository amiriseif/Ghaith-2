# Architecture Overview

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB BROWSER (React App)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   App.jsx        │         │   PhoneFrame.jsx         │  │
│  │  ─────────────   │         │  ──────────────────────  │  │
│  │ • Serial Port    │────────▶│  • Phone UI              │  │
│  │ • Serial Reader  │         │  • Dashboard Cards       │  │
│  │ • State Mgmt     │◀────────│  • Real-time Display     │  │
│  │ • Servo Control  │         │  • Animations            │  │
│  └──────────────────┘         └──────────────────────────┘  │
│        │                                                      │
│        │  Web Serial API                                    │
│        │  (JSON bidirectional)                             │
│        │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          │ USB Serial Connection
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│         Microcontroller (Arduino/ESP32/etc.)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Sensors      │  │ Servo Motor  │  │ Serial UART       │  │
│  │ ────────     │  │ ────────     │  │ ────────────────  │  │
│  │ • Water      │  │ • Gate       │  │ TX: Send JSON     │  │
│  │ • Turbine    │  │   Control    │  │ RX: Receive Cmd   │  │
│  │ • Temp       │  │              │  │                   │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── State:
│   ├── serialData (waterLevel, turbineSpeed, etc.)
│   ├── isConnected
│   ├── port
│   └── reader
├── Methods:
│   ├── connectSerial()
│   ├── readSerialData()
│   ├── toggleServo()
│   └── disconnectSerial()
└── Children:
    ├── Control Panel (UI)
    └── PhoneFrame
        ├── Status Bar
        ├── Header (Logo + Status)
        └── Dashboard Cards:
            ├── Water Level Card
            ├── Rain Intensity Card
            ├── Gate Control Card
            ├── Temperature Card
            └── Debug Info Card
```

## Data Flow

### Incoming (Microcontroller → App)

```
Microcontroller sends:
{"waterLevel": 65, "turbineSpeed": 120, "servoState": false, "temperature": 28}\n

↓ (via Web Serial API)

React App receives in stream

↓

Parse JSON

↓

Update State (setSerialData)

↓

Components re-render with new data

↓

Display updates in Phone UI
```

### Outgoing (App → Microcontroller)

```
User clicks Gate Toggle

↓

toggleServo() called

↓

Send via serial port:
{"servo": true}\n
      or
{"servo": false}\n

↓

Microcontroller receives & parses

↓

Controls servo motor

↓

Confirms by sending updated servoState
```

## File Dependencies

```
src/
├── main.jsx
│   └── imports: React, ReactDOM, App, index.css
│
├── App.jsx
│   ├── imports: React (useState, useEffect), PhoneFrame, App.css
│   └── exports: App component
│
├── components/
│   └── PhoneFrame.jsx
│       ├── imports: React (useState), phone.css
│       ├── receives props: data, onToggleServo, isConnected
│       └── exports: PhoneFrame component
│
├── styles/
│   ├── phone.css
│   │   └── All phone mockup and card styling
│   └── app.css
│       └── Control panel and layout
│
└── index.css
    └── Global styles

index.html
├── imports: main.jsx
└── provides: <div id="root">
```

## Key Technologies

- **React 18**: UI framework
- **Vite**: Build tool
- **Web Serial API**: Hardware communication
- **CSS3**: Styling (backdrop-filter, grid, animations)
- **JSON**: Data serialization

## Browser APIs Used

```javascript
// Web Serial API - Core functionality
navigator.serial.requestPort()     // Select device
port.open()                        // Open connection
port.readable.pipeTo()             // Read stream
port.writable.write()              // Send data

// Stream Readers
TextDecoderStream                  // Convert bytes to strings
ReadableStreamDefaultReader        // Parse incoming data
```

## Styling Architecture

```
CSS Layers (top to bottom):

1. Global (index.css)
   └─ Body, fonts, colors

2. Layout (App.css)
   └─ Flex containers, control panel

3. Phone Frame (phone.css)
   ├─ Phone body
   ├─ Notch/buttons
   ├─ Screen
   ├─ Status bar
   ├─ Cards (glassmorphism)
   ├─ Water animation
   ├─ Meter colors
   ├─ Toggle switch
   └─ Scrollbar
```

## State Management Flow

```
App.jsx maintains:
├── serialData
│   ├── status: 'Online'|'Offline'
│   ├── waterLevel: 0-100
│   ├── turbineSpeed: 0-300+
│   ├── servoState: true|false
│   └── temperature: integer
│
├── isConnected: boolean
├── port: SerialPort object
└── reader: ReadableStreamDefaultReader

PhoneFrame.jsx receives:
├── data (all serialData)
├── onToggleServo (callback)
└── isConnected (boolean)
```

## Performance Considerations

1. **Serial Read Rate**: App reads continuously but state updates batched by JSON lines
2. **Component Re-renders**: Only PhoneFrame re-renders on data change (React optimization)
3. **CSS Animations**: GPU-accelerated (transform, opacity)
4. **Memory**: Reader loops continuously but efficiently processes streams
5. **Network**: No backend - purely browser-device communication

## Error Handling

```
Serial Connection Errors
├─ Port not selected
│  └─ Silently handle (user closed dialog)
├─ Port already in use
│  └─ Catch and log to console
├─ Serial read failure
│  └─ Disconnect and set state offline
└─ JSON parse error
   └─ Log to console, continue reading

JSON Parse Errors
├─ Non-JSON data received
│  └─ Log and skip line
└─ Malformed JSON
   └─ Log and skip line
```

## Future Enhancements

- Local storage for historical data
- Graph/chart display
- Data export (CSV)
- Multiple device support
- Advanced filtering/alarming
- PWA support for offline use
- Dark/light theme toggle
