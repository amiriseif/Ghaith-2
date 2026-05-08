/*
 * Serial Simulator for Testing
 * 
 * This file provides a simulator that can be used for testing the React app
 * without actual hardware. You can run this on another terminal/device to send
 * simulated sensor data.
 * 
 * Usage with virtual COM ports or USB-UART bridge:
 * - Create a virtual serial port pair (com0com on Windows, socat on Linux)
 * - Run this script on one port
 * - Connect React app to the other port
 */

// Python version (saved as serial_simulator.py)
// Uncomment and use if you have Python installed

/*
import serial
import json
import time
import random

# Adjust COM port as needed (COM3, /dev/ttyUSB0, etc.)
PORT = "COM3"
BAUDRATE = 9600

try:
    ser = serial.Serial(PORT, BAUDRATE, timeout=1)
    print(f"Connected to {PORT}")
    
    water_level = 50
    turbine_speed = 0
    servo_state = False
    temperature = 25
    
    while True:
        # Simulate changing values
        water_level = max(0, min(100, water_level + random.randint(-2, 2)))
        turbine_speed = max(0, min(300, turbine_speed + random.randint(-10, 15)))
        temperature = max(15, min(35, temperature + random.uniform(-0.5, 0.5)))
        
        # Create JSON and send
        data = {
            "waterLevel": water_level,
            "turbineSpeed": int(turbine_speed),
            "servoState": servo_state,
            "temperature": int(temperature)
        }
        
        json_str = json.dumps(data)
        ser.write((json_str + '\n').encode())
        print(f"Sent: {json_str}")
        
        # Check for incoming commands
        if ser.in_waiting:
            incoming = ser.readline().decode().strip()
            print(f"Received: {incoming}")
            try:
                cmd = json.loads(incoming)
                if "servo" in cmd:
                    servo_state = cmd["servo"]
                    print(f"Servo set to: {servo_state}")
            except:
                pass
        
        time.sleep(0.5)
        
except Exception as e:
    print(f"Error: {e}")
finally:
    if ser.is_open:
        ser.close()
        print("Port closed")
*/

// JavaScript/Node.js version
// Requires: npm install serialport
// Usage: node serial_simulator.js

/*
const SerialPort = require("serialport").SerialPort;
const readline = require("readline");

const PORT = "COM3"; // Adjust as needed
const BAUDRATE = 9600;

const port = new SerialPort({
  path: PORT,
  baudRate: BAUDRATE
});

port.on("open", () => {
  console.log(`Connected to ${PORT}`);

  let waterLevel = 50;
  let turbineSpeed = 0;
  let servoState = false;
  let temperature = 25;
  let buffer = "";

  // Send data every 500ms
  const interval = setInterval(() => {
    waterLevel = Math.max(0, Math.min(100, waterLevel + (Math.random() - 0.5) * 4));
    turbineSpeed = Math.max(
      0,
      Math.min(300, turbineSpeed + (Math.random() - 0.5) * 20)
    );
    temperature = Math.max(
      15,
      Math.min(35, temperature + (Math.random() - 0.5))
    );

    const data = {
      waterLevel: Math.round(waterLevel),
      turbineSpeed: Math.round(turbineSpeed),
      servoState: servoState,
      temperature: Math.round(temperature)
    };

    const jsonStr = JSON.stringify(data) + "\n";
    port.write(jsonStr, (err) => {
      if (err) console.error("Send error:", err);
      else console.log("Sent:", jsonStr.trim());
    });
  }, 500);

  // Receive commands
  port.on("data", (data) => {
    buffer += data.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        try {
          const cmd = JSON.parse(line);
          if (cmd.servo !== undefined) {
            servoState = cmd.servo;
            console.log(`Gate set to: ${servoState ? "OPEN" : "CLOSED"}`);
          }
        } catch (e) {
          console.log("Parse error:", line);
        }
      }
    }
  });

  port.on("error", (err) => {
    console.error("Port error:", err);
  });

  port.on("close", () => {
    clearInterval(interval);
    console.log("Port closed");
    process.exit(0);
  });
});
*/
