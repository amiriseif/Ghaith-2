import '../styles/phone.css'

export default function PhoneFrame({ data, isConnected }) {
  return (
    <div className="phone-container">
      <div className="phone-frame">
        {/* Notch / Dynamic Island */}
        <div className="notch"></div>

        {/* Side Buttons */}
        <div className="button-group volume">
          <div className="button-volume up"></div>
          <div className="button-volume down"></div>
        </div>
        <div className="button-power"></div>

        {/* Phone Screen Content */}
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="system-info">
              <span className="time" id="time">9:41</span>
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                ● System {data.status}
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="phone-header">
            <h1 className="ghaith-logo">
              GHAITH
              <span className="pulse-dot"></span>
            </h1>
            <p className="sub-text">Water Monitoring System</p>
          </div>

          {/* Dashboard Content */}
          <div className="phone-content">
            {/* Water Level Card */}
            <div className="card water-card">
              <div className="card-header">Water Level</div>
              <div className="water-container">
                <div className="water-bottle">
                  <div className="water-fill" style={{ height: `${data.waterLevel}%` }}></div>
                  <div className="water-wave"></div>
                </div>
                <div className="water-text">{data.waterLevel}%</div>
              </div>
            </div>

            {/* Rain Level Card */}
            <div className="card rain-card">
              <div className="card-header">Rain Level</div>
              <div className="rain-display">
                <div className="rain-value">{100-data.rainLevel}%</div>
                <div className="rain-status">
                  {data.rainLevel === 100 && '☀️ No Rain'}
                  {data.rainLevel < 50 && data.rainLevel > 0 && '🌧️ Light Rain'}
                  {data.rainLevel <= 50 && '⛈️ Heavy Rain'}
                </div>
              </div>
            </div>

            {/* System Info Card */}
            <div className="card info-card">
              <div className="card-header">System Status</div>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`info-value ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Water Level:</span>
                  <span className="info-value">{data.waterLevel}%</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Rain Level:</span>
                  <span className="info-value">{data.rainLevel}%</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Motor:</span>
                  <span className={`info-value ${data.motorOn ? 'motor-on' : 'motor-off'}`}>
                    {data.motorOn ? '✓ Running' : '◯ Stopped'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
