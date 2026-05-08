import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import './App.css'

function App() {
  const [serialData, setSerialData] = useState({
    status: 'Offline',
    waterLevel: 0,
    rainLevel: 0,
    motorOn: false
  })
  const [isConnected, setIsConnected] = useState(false)
  const [port, setPort] = useState(null)
  const [writer, setWriter] = useState(null)

  const connectSerial = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort()
      await selectedPort.open({ baudRate: 9600 })
      setPort(selectedPort)
      setIsConnected(true)

      // Set up writer for sending commands
      const textEncoder = new TextEncoderStream()
      textEncoder.readable.pipeTo(selectedPort.writable)
      setWriter(textEncoder.writable.getWriter())

      // Set up reader for receiving data
      readSerialData(selectedPort)
    } catch (err) {
      console.error('Failed to connect:', err)
      setIsConnected(false)
    }
  }

  const readSerialData = async (selectedPort) => {
    try {
      const textDecoder = new TextDecoderStream()
      selectedPort.readable.pipeTo(textDecoder.writable)
      const reader = textDecoder.readable.getReader()
      
      let buffer = ''
      
      while (true) {
        const { value, done } = await reader.read()
        
        if (done) {
          console.log('Serial stream closed')
          break
        }
        
        if (value) {
          buffer += value
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine.length > 0) {
              try {
                const data = JSON.parse(trimmedLine)
                console.log('✓ Data received:', data)
                setSerialData(prev => ({
                  ...prev,
                  ...data,
                  status: 'Online'
                }))
              } catch (parseErr) {
                console.warn('Failed to parse JSON:', trimmedLine, parseErr.message)
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Serial read error:', err)
      setIsConnected(false)
      setSerialData({
        status: 'Offline',
        waterLevel: 0,
        rainLevel: 0,
        motorOn: false
      })
    }
  }

  const sendCommand = async (command) => {
    if (!writer) {
      console.error('Writer not initialized')
      return
    }
    try {
      await writer.write(command + '\n')
      console.log('✓ Command sent:', command)
    } catch (err) {
      console.error('Failed to send command:', err)
    }
  }

  const toggleMotor = async () => {
    const newState = !serialData.motorOn
    const command = newState ? 'MOTOR_ON' : 'MOTOR_OFF'
    await sendCommand(command)
    
    // Update UI optimistically
    setSerialData(prev => ({
      ...prev,
      motorOn: newState
    }))
  }

  const disconnectSerial = async () => {
    if (writer) {
      try {
        await writer.close()
      } catch (e) {
        console.log('Writer close error (expected):', e)
      }
      setWriter(null)
    }
    if (port) {
      try {
        await port.close()
      } catch (e) {
        console.log('Port close error (expected):', e)
      }
      setPort(null)
    }
    setIsConnected(false)
    setSerialData({
      status: 'Offline',
      waterLevel: 0,
      rainLevel: 0,
      motorOn: false
    })
  }

  return (
    <div className="app-container">
      <div className="control-panel">
        <h1>Ghaith System</h1>
        {!isConnected ? (
          <button onClick={connectSerial} className="btn-primary">
            Connect Serial Port
          </button>
        ) : (
          <button onClick={disconnectSerial} className="btn-danger">
            Disconnect
          </button>
        )}
        <p className="status-indicator">
          Status: <span className={isConnected ? 'online' : 'offline'}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </p>
        
        {isConnected && (
          <div className="debug-panel">
            <h3>Live Data</h3>
            <p><strong>Water Level:</strong> {serialData.waterLevel}%</p>
            <p><strong>Rain Level:</strong> {serialData.rainLevel}%</p>
            <p><strong>Motor:</strong> {serialData.motorOn ? '✓ ON' : '◯ OFF'}</p>
            
            <button 
              onClick={toggleMotor}
              className={`motor-btn ${serialData.motorOn ? 'motor-on' : 'motor-off'}`}
            >
              {serialData.motorOn ? '🛑 Turn Motor OFF' : '▶️ Turn Motor ON'}
            </button>
            
            <p className="debug-note">Check browser console (F12) for detailed logs</p>
          </div>
        )}
      </div>

      <PhoneFrame 
        data={serialData}
        isConnected={isConnected}
      />
    </div>
  )
}

export default App
