/*
 * Ghaith Irrigation System - Arduino Example
 * 
 * This sketch demonstrates how to send sensor data to the React web app
 * via serial communication in JSON format.
 * 
 * Hardware Setup:
 * - Water level sensor: Analog input A0
 * - RPM sensor (interrupt): Digital input 2
 * - Servo motor: Digital output 9
 * - Temperature sensor: Analog input A1
 */

#include <ArduinoJson.h>
#include <Servo.h>

// Pins
const int WATER_SENSOR_PIN = A0;
const int TEMP_SENSOR_PIN = A1;
const int RPM_SENSOR_PIN = 2;
const int SERVO_PIN = 9;

// Variables
Servo gateServo;
volatile int rpmCounter = 0;
unsigned long lastRpmRead = 0;
int currentRPM = 0;
bool servoState = false;
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 500; // Send data every 500ms

// JSON document for sending
StaticJsonDocument<200> sendDoc;
StaticJsonDocument<200> recvDoc;

void setup() {
  Serial.begin(9600);
  
  // Servo setup
  gateServo.attach(SERVO_PIN);
  gateServo.write(0); // Start closed
  
  // RPM sensor interrupt
  attachInterrupt(digitalPinToInterrupt(RPM_SENSOR_PIN), countRPM, RISING);
  
  pinMode(WATER_SENSOR_PIN, INPUT);
  pinMode(TEMP_SENSOR_PIN, INPUT);
  
  delay(100);
  Serial.println("{\"status\":\"initialized\"}");
}

void loop() {
  // Read incoming commands from web app
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\n');
    if (deserializeJson(recvDoc, incoming) == DeserializationError::Ok) {
      if (recvDoc.containsKey("servo")) {
        servoState = recvDoc["servo"];
        gateServo.write(servoState ? 180 : 0);
      }
    }
  }
  
  // Calculate RPM (count pulses over 1 second interval)
  if (millis() - lastRpmRead >= 1000) {
    currentRPM = rpmCounter;
    rpmCounter = 0;
    lastRpmRead = millis();
  }
  
  // Send sensor data every SEND_INTERVAL
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    sendSensorData();
    lastSendTime = millis();
  }
}

void countRPM() {
  rpmCounter++;
}

void sendSensorData() {
  // Read sensors
  int waterRaw = analogRead(WATER_SENSOR_PIN);
  int tempRaw = analogRead(TEMP_SENSOR_PIN);
  
  // Convert water level (0-1023 -> 0-100%)
  int waterLevel = map(waterRaw, 0, 1023, 0, 100);
  
  // Convert temperature (example conversion for LM35)
  // LM35: 10mV per °C, so at 5V ref: voltage * 100 / 5 = temp
  float tempVoltage = (tempRaw / 1023.0) * 5.0;
  int temperature = (int)(tempVoltage * 100); // Adjust formula for your sensor
  
  // Build JSON
  sendDoc.clear();
  sendDoc["waterLevel"] = waterLevel;
  sendDoc["turbineSpeed"] = currentRPM;
  sendDoc["servoState"] = servoState;
  sendDoc["temperature"] = temperature;
  
  // Send as JSON
  serializeJson(sendDoc, Serial);
  Serial.println(); // Add newline
}

/*
 * ALTERNATIVE: Without ArduinoJson library
 * Uncomment below and comment out the JSON library usage above
 * 
void sendSensorDataSimple() {
  int waterRaw = analogRead(WATER_SENSOR_PIN);
  int tempRaw = analogRead(TEMP_SENSOR_PIN);
  
  int waterLevel = map(waterRaw, 0, 1023, 0, 100);
  float tempVoltage = (tempRaw / 1023.0) * 5.0;
  int temperature = (int)(tempVoltage * 100);
  
  // Manual JSON string
  Serial.print("{\"waterLevel\":");
  Serial.print(waterLevel);
  Serial.print(",\"turbineSpeed\":");
  Serial.print(currentRPM);
  Serial.print(",\"servoState\":");
  Serial.print(servoState ? "true" : "false");
  Serial.print(",\"temperature\":");
  Serial.print(temperature);
  Serial.println("}");
}
*/
