#include <ESP8266WiFi.h>
#include <Wire.h>  // Only needed for Arduino 1.6.5 and earlier
#include "SSD1306Wire.h" // legacy include: `#include "SSD1306.h"`
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
 
// Initialize the OLED display using Wire library
SSD1306Wire  display1(0x3c, D2, D1);  //D2=SDK  D1=SCK  As per labeling on NodeMCU
SSD1306Wire  display2(0x3c, D4, D3);  //D2=SDK  D1=SCK  As per labeling on NodeMCU
SSD1306Wire  display3(0x3c, D6, D5);  //D2=SDK  D1=SCK  As per labeling on NodeMCU

ESP8266WiFiMulti WiFiMulti;

#define USE_SERIAL Serial

#define Clear_width 32
#define Clear_height 32
static unsigned char Clear_bits[] = {
  0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x81, 0x81, 0x00,
  0x00, 0x83, 0xC1, 0x00, 0x00, 0x86, 0x40, 0x00, 0x00, 0x04, 0x60, 0x00,
  0x00, 0x0C, 0x20, 0x00, 0x08, 0xC0, 0x03, 0x00, 0x18, 0xF8, 0x0F, 0x38,
  0x70, 0xFC, 0x3F, 0x0C, 0x40, 0xFE, 0x7F, 0x06, 0x00, 0xFE, 0xFF, 0x00,
  0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x80, 0xFF, 0xFF, 0x01,
  0x9F, 0xFF, 0xFF, 0xFD, 0x82, 0xFF, 0xFF, 0x51, 0x80, 0xFF, 0xFF, 0x01,
  0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x20, 0xFF, 0xFF, 0x02,
  0x70, 0xFE, 0x7F, 0x06, 0x1C, 0xFC, 0x3F, 0x3C, 0x04, 0xF8, 0x1F, 0x20,
  0x00, 0xC0, 0x03, 0x00, 0x00, 0x06, 0x20, 0x00, 0x00, 0x06, 0x60, 0x00,
  0x00, 0x82, 0xC1, 0x00, 0x00, 0x83, 0x81, 0x00, 0x00, 0x81, 0x80, 0x00,
  0x00, 0x80, 0x01, 0x00, 0x00, 0x80, 0x00, 0x00};

#define Cloudy_width 32
#define Cloudy_height 32
static unsigned char Cloudy_bits[] = {
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x1E, 0x00, 0x00, 0x80, 0xFF, 0x00, 0x00, 0xE0, 0xFF, 0x01,
  0x00, 0xF0, 0xC0, 0x03, 0x00, 0x7E, 0x80, 0x03, 0x80, 0x3F, 0x00, 0x07,
  0xC0, 0x17, 0x00, 0x07, 0xC0, 0x01, 0x00, 0x1F, 0xE0, 0x00, 0x00, 0x3E,
  0xF8, 0x00, 0x00, 0x78, 0xFE, 0x00, 0x00, 0xE0, 0x1E, 0x00, 0x00, 0xE0,
  0x07, 0x00, 0x00, 0xC0, 0x07, 0x00, 0x00, 0xE0, 0x07, 0x00, 0x00, 0xE0,
  0x07, 0x00, 0x00, 0x70, 0x0E, 0x00, 0x00, 0x70, 0xDE, 0xDD, 0x77, 0x7F,
  0xFE, 0xFF, 0xFF, 0x3F, 0xF0, 0xFF, 0xFF, 0x07, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

#define Rain_width 32
#define Rain_height 32
static unsigned char Rain_bits[] = {
  0x00, 0x00, 0x3E, 0x00, 0x00, 0xC0, 0xFF, 0x00, 0x00, 0xE0, 0xFF, 0x01,
  0x00, 0xE0, 0xC0, 0x03, 0x00, 0x7F, 0x80, 0x03, 0x80, 0x3F, 0x00, 0x07,
  0xC0, 0x17, 0x00, 0x07, 0xC0, 0x01, 0x00, 0x1F, 0xE0, 0x00, 0x00, 0x3E,
  0xF8, 0x00, 0x00, 0x70, 0x7E, 0x00, 0x00, 0xE0, 0x4E, 0x00, 0x00, 0xE0,
  0x07, 0x00, 0x00, 0xE0, 0x07, 0x00, 0x00, 0xE0, 0x07, 0x00, 0x00, 0xE0,
  0x07, 0x00, 0x00, 0x60, 0x0F, 0x00, 0x00, 0x70, 0xFE, 0xFD, 0xFF, 0x3F,
  0xFC, 0xFF, 0xFF, 0x1F, 0xF0, 0xFF, 0xFD, 0x07, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x03, 0x80, 0x00, 0xC0, 0x03, 0xC0, 0x01, 0xE0, 0x03,
  0xF0, 0x01, 0xE0, 0x03, 0xF0, 0x01, 0xE0, 0x01, 0xF0, 0x80, 0xE1, 0x01,
  0xF0, 0xC0, 0x01, 0x00, 0x00, 0xE0, 0x01, 0x00, 0x00, 0xF0, 0x01, 0x00,
  0x00, 0xF0, 0x01, 0x00, 0x00, 0xE0, 0x00, 0x00};

#define Trash_width 32
#define Trash_height 32
static unsigned char Trash_bits[] = {
  0x00, 0x00, 0x01, 0x00, 0x00, 0x84, 0x07, 0x00, 0x00, 0x9C, 0x1F, 0x00,
  0x00, 0xFE, 0x38, 0x00, 0x00, 0xFC, 0xF1, 0x00, 0x00, 0xF8, 0x63, 0x00,
  0x00, 0xE0, 0x7F, 0x00, 0x00, 0x80, 0x3F, 0x00, 0x00, 0x00, 0xFE, 0x00,
  0x00, 0x00, 0xFC, 0x01, 0x00, 0x00, 0xF0, 0x01, 0x00, 0x00, 0xC0, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x80, 0xFF, 0xFF, 0x00, 0x80, 0xFF, 0x7F, 0x00,
  0x80, 0xFF, 0xFF, 0x00, 0x80, 0xFB, 0xF7, 0x00, 0x80, 0x3F, 0xF7, 0x00,
  0x80, 0x7B, 0x77, 0x00, 0x80, 0xFB, 0xF7, 0x00, 0x80, 0x7B, 0xF7, 0x00,
  0x80, 0x7B, 0x77, 0x00, 0x80, 0xFF, 0xF7, 0x00, 0x80, 0x3B, 0xF7, 0x00,
  0x80, 0x7B, 0x77, 0x00, 0x80, 0xFF, 0xF7, 0x00, 0x80, 0x7B, 0xF7, 0x00,
  0x80, 0x7B, 0x77, 0x00, 0x80, 0x7B, 0xF7, 0x00, 0x80, 0xFF, 0xFF, 0x00,
  0x80, 0xFF, 0x7F, 0x00, 0x80, 0xFF, 0xFF, 0x00
};
 
void setup() {
  delay(1000);
  USE_SERIAL.begin(115200);  
  
  USE_SERIAL.println("-------------------------");
  USE_SERIAL.println("Initializing OLED Display");
  USE_SERIAL.println("-------------------------");
  
  display1.init();
  display2.init();
  display3.init();
  
  // This will make sure that multiple instances of a display driver
  // running on different ports will work together transparently
  display1.setI2cAutoInit(true);
  display2.setI2cAutoInit(true);
  display3.setI2cAutoInit(true);
  
  display1.flipScreenVertically();
  display2.flipScreenVertically();
  display3.flipScreenVertically();
  
  display1.setFont(ArialMT_Plain_10);
  display2.setFont(ArialMT_Plain_10);
  display3.setFont(ArialMT_Plain_10);
  
  drawLoadingScreen();
  USE_SERIAL.println("-------------------------");
  USE_SERIAL.println("Initializing WIFI");
  USE_SERIAL.println("-------------------------");
  for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }
    WiFiMulti.addAP("Drahtlosbox", "LiWeMi!8888");
}
 
void loop() {
  // wait for WiFi connection
  if((WiFiMulti.run() == WL_CONNECTED)) {
      handleWeatherData();
      handleTrainConnections();
      handleWasteDate();      
      delay(10000);
      handleMarkets();
      delay(10000);
      handleRssFeed();
  }
  delay(10000);
}

void handleWeatherData() {
  HTTPClient http;
  USE_SERIAL.print("[HTTP] begin...\n");        
  http.begin("http://homeinfoserver.herokuapp.com/api/weather"); //HTTP
  http.addHeader("Content-Type", "application/json");
  USE_SERIAL.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  String payload = http.getString();
  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          USE_SERIAL.println(payload);
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          JsonObject weatherData = doc.as<JsonObject>();                            
          drawWeatherScreen(weatherData[String("name")], weatherData[String("temp")], weatherData[String("tempTomorrow")], weatherData[String("code")],
          weatherData[String("date")], weatherData[String("feelslike")], weatherData[String("windspeed")], weatherData[String("humidity")]);
      }
  } else {
      USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void handleWasteDate() {
  HTTPClient http;
  USE_SERIAL.print("[HTTP] begin...\n");        
  http.begin("http://homeinfoserver.herokuapp.com/api/waste"); //HTTP
  http.addHeader("Content-Type", "application/json");
  USE_SERIAL.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  String payload = http.getString();
  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          USE_SERIAL.println(payload);
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          JsonObject wasteDate = doc.as<JsonObject>();                            
          drawWasteDateScreen(wasteDate[String("type")], wasteDate[String("dateSimple")], wasteDate[String("day")]);
      }
  } else {
      USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void handleTrainConnections() {
  HTTPClient http;
  USE_SERIAL.print("[HTTP] begin...\n");        
  http.begin("http://homeinfoserver.herokuapp.com/api/train"); //HTTP
  http.addHeader("Content-Type", "application/json");
  USE_SERIAL.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  String payload = http.getString();
  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          USE_SERIAL.println(payload);
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          //JsonObject trainConnections = doc.as<JsonObject>();                            
          JsonArray array = doc.as<JsonArray>();
          display1.clear();
          int i = 0;
          for(JsonObject connection : array) {
              String line = connection[String("line")];
              String destination = connection[String("destination")];
              String minutes = connection[String("minutes")];
              display1.setTextAlignment(TEXT_ALIGN_LEFT);
              display1.setFont(ArialMT_Plain_10);
              display1.drawString(5, 0 + i * 15, line);
              display1.drawString(25, 0 + i * 15, destination);
              display1.setTextAlignment(TEXT_ALIGN_RIGHT);
              display1.drawString(120, 0 + i * 15, minutes);
              i++;
          }
          display1.display();
      }
  } else {
      USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void handleMarkets() {
  HTTPClient http;
  USE_SERIAL.print("[HTTP] begin...\n");        
  http.begin("http://homeinfoserver.herokuapp.com/api/market"); //HTTP
  http.addHeader("Content-Type", "application/json");
  USE_SERIAL.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  String payload = http.getString();
  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          USE_SERIAL.println(payload);
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          JsonArray array = doc.as<JsonArray>();
          display3.clear();
          int i = 0;
          for(JsonObject connection : array) {
              String location = connection[String("location")];
              String date = connection[String("date")];
              display3.setTextAlignment(TEXT_ALIGN_LEFT);
              display3.setFont(ArialMT_Plain_10);
              display3.drawString(5, 0 + i * 15, date);
              display3.drawString(25, 0 + i * 15, location);
              i++;
          }
          display3.display();
      }
  } else {
      USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void handleRssFeed() {
  HTTPClient http;
  USE_SERIAL.print("[HTTP] begin...\n");        
  http.begin("http://homeinfoserver.herokuapp.com/api/rss"); //HTTP
  http.addHeader("Content-Type", "application/json");
  USE_SERIAL.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  String payload = http.getString();
  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          USE_SERIAL.println(payload);
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          JsonObject rss = doc.as<JsonObject>();                            
          drawRssScreen(rss[String("title")], rss[String("date")]);
      }
  } else {
      USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void drawLoadingScreen() {
  display1.clear();
  display1.setTextAlignment(TEXT_ALIGN_LEFT);
  display1.setFont(ArialMT_Plain_16);
  display1.drawString(0, 20, "connecting");
  display1.drawString(0, 40,  "to server...");
  display1.display();

  display2.clear();
  display2.setTextAlignment(TEXT_ALIGN_LEFT);
  display2.setFont(ArialMT_Plain_16);
  display2.drawString(0, 20, "connecting");
  display2.drawString(0, 40,  "to server...");
  display2.display();

  display3.clear();
  display3.setTextAlignment(TEXT_ALIGN_LEFT);
  display3.setFont(ArialMT_Plain_16);
  display3.drawString(0, 20, "connecting");
  display3.drawString(0, 40,  "to server...");
  display3.display();
}

void drawWeatherScreen(String name, String temp, String tempTomorrow, String code, String date, 
                       String feelslike, String windspeed, String humidity) {   
  display2.clear();
  if (code == "31" || code == "32") {
    display2.drawXbm(0, 0, Clear_width, Clear_height, Clear_bits);
  } else if (code == "10" || code == "11" || code == "12"){
    display2.drawXbm(0, 0, Rain_width, Rain_height, Rain_bits);
  } else {
    display2.drawXbm(0, 0, Cloudy_width, Cloudy_height, Cloudy_bits);
  }
  display2.setTextAlignment(TEXT_ALIGN_LEFT);
  display2.setFont(ArialMT_Plain_24);
  display2.drawString(0, 32, temp);
  display2.setFont(ArialMT_Plain_10);
  display2.drawString(5, 54, feelslike);

  display2.setFont(ArialMT_Plain_16);
  display2.drawString(55, 0, date);
  display2.drawString(55, 16, tempTomorrow);
  display2.drawString(55, 32, windspeed);
  display2.drawString(55, 48, humidity);
  
  display2.display();
}


void drawWasteDateScreen(String type, String dateSimple, String day) {   
  display3.clear();
  display3.setTextAlignment(TEXT_ALIGN_LEFT);
  display3.setFont(ArialMT_Plain_24);
  display3.drawString(5, 0, type);
  display3.setFont(ArialMT_Plain_16);
  display3.drawString(5, 25, dateSimple);
  display3.drawString(5, 42, day);
  display3.drawXbm(80, 10, Trash_width, Trash_height, Trash_bits);

  display3.display();
}

void drawRssScreen(String title, String date) {
  display3.clear();
  display3.setTextAlignment(TEXT_ALIGN_LEFT);
  display3.setFont(ArialMT_Plain_16);
  display3.drawString(5, 0, date);
  display3.setFont(ArialMT_Plain_10);
  display3.drawString(5, 30, title);

  display3.display();
}
