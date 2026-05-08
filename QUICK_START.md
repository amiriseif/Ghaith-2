# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd "c:\Users\seifl\Ghaith 2"
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```
The app will automatically open at `http://localhost:3000`

### Step 3: Connect Your Device
1. Click "Connect Serial Port" button
2. Select your microcontroller/Arduino from the list
3. The app will start displaying real-time data

## What You Get

### 🎨 Realistic Phone Mockup
- Authentic iPhone-style frame with notch
- Physical side buttons (volume/power)
- Smooth scrolling dashboard
- Glassmorphism UI with backdrop blur

### 📊 Live Data Display
- **Water Level**: Ultrasonic sensor reading (0-100%)
- **Rain Level**: Rain/water detector reading (0-100%)
- **Motor Status**: Motor ON/OFF indicator
- **System Status**: Connected/Disconnected indicator

### 🔌 Serial Communication
- Uses Web Serial API (Chrome/Edge 89+)
- Auto-parses JSON data from serial port
- Read-only (sensor data only)
- 9600 baud rate (configurable)

## Data Format

Your microcontroller should send JSON like this every 500ms or as needed:

```json
{"waterLevel": 65, "rainLevel": 30, "motorOn": false}
```

Each line must be a complete JSON object followed by newline (`\n`).

## Arduino Quick Example

```cpp
void sendData() {
  Serial.print("{\"waterLevel\":");
  Serial.print(waterLevel);
  Serial.print(",\"temperature\":");
  Serial.print(temperature);
  Serial.println("}");
}
```

See `Ghaith_Arduino_Code.txt` for complete example.

## File Structure

```
src/
├── App.jsx                    # Main app + serial logic
├── components/
│   └── PhoneFrame.jsx        # Phone UI component
└── styles/
    └── phone.css             # All styling

package.json                  # Dependencies
```

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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port dropdown empty | Use Chrome/Edge (not Firefox/Safari) |
| Data not updating | Check JSON format in serial output |
| Phone mockup too small | Browser is zoomed - try Ctrl+0 |
| Can't parse data | Ensure each line ends with `\n` |

## Testing Without Hardware

Use `SERIAL_SIMULATOR.md` for Python/Node.js scripts to simulate sensor data.

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Edge    | ✅ Full |
| Firefox | ⚠️ Limited |
| Safari  | ❌ None |

## Next Steps

1. ✅ Install and run the app
2. ✅ Connect your microcontroller
3. ✅ Start sending data
4. ✅ Customize colors/layout as needed

For production build:
```bash
npm run build
```

Output will be in `dist/` folder - ready to deploy!
