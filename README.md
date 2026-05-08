# Ghaith - Irrigation System Monitor

A React-based mobile phone mockup interface for monitoring a water system via serial connection.

## Features

- **Realistic Phone Mockup**: CSS-based iPhone device frame with notch, buttons, and screen
- **Serial Port Communication**: Connect to microcontroller via Web Serial API
- **Live Data Monitoring**:
  - Water Level Display: Ultrasonic sensor reading (0-100%)
  - Rain Level Display: Rain/water detector reading (0-100%)
  - Motor Status: ON/OFF indicator
  - System Status Indicator
  - Real-time sensor reading updates

- **Glassmorphism UI**: Semi-transparent cards with backdrop blur effects
- **Responsive Design**: Adapts to different screen sizes
- **Three Sensor System**: Ultrasonic water level + rain detector + motor control

## Project Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx              # Main app component with serial connection logic
├── components/
│   └── PhoneFrame.jsx   # Phone mockup UI component
├── styles/
│   └── phone.css        # All phone and UI styling
├── App.css              # App layout styling
└── index.css            # Global styles

index.html              # HTML entry point
package.json            # Dependencies
vite.config.js          # Vite configuration
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Serial Data Format

Send JSON data from your microcontroller via serial (9600 baud):

```json
{
  "waterLevel": 65,
  "rainLevel": 30,
  "motorOn": false
}
```

### Data Fields:
- **waterLevel** (0-100): Water tank percentage (ultrasonic sensor)
- **rainLevel** (0-100): Rain/water detector percentage
- **motorOn** (true/false): Motor running status

### Send Multiple Lines:
Each line should be a complete JSON object followed by `\n`:
```
{"waterLevel": 65, "rainLevel": 30, "motorOn": false}\n
{"waterLevel": 66, "rainLevel": 35, "motorOn": true}\n
```

## Usage

1. Click "Connect Serial Port" button
2. Select your microcontroller/device from the dialog
3. The app will automatically read and parse JSON data every line
4. Data updates display in real-time in the phone mockup
5. Use the "Turn Motor ON/OFF" button in the debug panel to control the motor

## Motor Control

### From Web App:
- Connected device shows a debug panel with live data
- Click "**Turn Motor ON**" (green) or "**Turn Motor OFF**" (red) button
- Command is sent via serial to Arduino: `MOTOR_ON` or `MOTOR_OFF`
- Arduino processes the command and updates motor pin D9

### Arduino Response:
When motor command is received, Arduino sends:
```json
{"motorOn": true, "status": "Motor ON"}
```
or
```json
{"motorOn": false, "status": "Motor OFF"}
```

### Serial Protocol:
```
WEB APP → ARDUINO:  MOTOR_ON\n  or  MOTOR_OFF\n
ARDUINO → WEB APP:  {"motorOn": true/false, "status": "..."}\n
```

## Browser Support

- **Chrome/Edge**: Full support (Web Serial API)
- **Firefox**: Limited support
- **Safari**: Not supported (Web Serial API not available)

## Customization

### Change Baud Rate
Edit `src/App.jsx`:
```javascript
await selectedPort.open({ baudRate: 115200 }) // Change to your baud rate
```

### Adjust Phone Size
Edit `src/styles/phone.css`:
```css
.phone-frame {
  width: 375px;  /* Adjust width */
  height: 812px; /* Adjust height */
}
```

### Add More Sensor Cards
Edit `src/components/PhoneFrame.jsx` and copy any `.card` section.

### Add Servo Motor Control (Optional)
If you want to add servo control later, refer to the original code in git history or contact support.

## Troubleshooting

### Serial connection not working
- Ensure browser supports Web Serial API (Chrome/Edge 89+)
- Device must be connected via USB
- Some browsers may require HTTPS (use over localhost in dev)

### Data not updating
- Check serial data format is valid JSON
- Ensure each line ends with `\n`
- Monitor browser console for parsing errors

### Phone mockup too small/large
- Edit scale in `@media` queries in `phone.css`
- Or modify `.phone-container` width/height

### Water Level or Ultrasonic not updating
- Verify ultrasonic sensor is connected to Arduino D10 (TRIGGER) and D11 (ECHO)
- Check Serial Monitor in Arduino IDE to see distance readings
- Verify JSON format: `{"waterLevel": X, "rainLevel": Y, "motorOn": Z}`
- Adjust calibration values in Arduino code (empty/full tank distances)

### Rain Level not updating
- Verify rain sensor is connected to Arduino A0
- Check if sensor is in dry or wet environment
- Test analog reading: Serial.println(analogRead(A0))

### Motor not responding
- Verify motor/relay is connected to Arduino D9
- Check relay power supply (VCC and GND)
- Ensure relay is properly wired to motor circuit

## Device Recommendations

Tested with:
- Arduino Uno/Nano (with Serial over USB)
- Arduino Mega (multiple sensors)
- ESP32 (WiFi optional)
- Any microcontroller with USB-UART bridge

Sensors:
- HC-SR04 Ultrasonic sensor (water level)
- Capacitive or float switch rain sensor
- DC motor with relay control

## License

MIT
