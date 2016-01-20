#!/usr/bin/env python

import time
import datetime
import math
import sys
import trollius
from trollius import From
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import grovepi
import grove_rgb_lcd as lcd
from concurrent.futures import ProcessPoolExecutor


# CONNECTORS
isLed1Variabel=True
led1 = 14
led2 = 15
led3= 16
switch = 5
button = 3

buzzer = 3
temphum = 8
ultrasonic_ranger = 4
relay = 7
pir_sensor = 6
#moisure=0

led1_status=False
led2_status=False
led3_status=False
relay_status=False
display_status=""
isNight=False;

# PINMODES
#INPUT
grovepi.pinMode(switch,"INPUT")
grovepi.pinMode(temphum,"INPUT")
grovepi.pinMode(ultrasonic_ranger,"INPUT")
grovepi.pinMode(pir_sensor,"INPUT")

#OUTPUT
grovepi.pinMode(led1,"OUTPUT")
grovepi.pinMode(led2,"OUTPUT")
grovepi.pinMode(buzzer,"OUTPUT")
grovepi.pinMode(relay,"OUTPUT")

#variables
canEdit = True
started = False
isReading=False

client = mqtt.Client()

#classes
class Input:

	temp = 0
	hum = 0
	range = 0
	pressed=False

def getStatusBool(ok):
	if ok==True :
		return 1
	else:
		return 0
def in_between(now, start, end):
	if start <= end:
		return start <= now < end
	else: # over midnight e.g., 23:30-04:15
		return start <= now or now < end

def on_connect(client, userdata, rc):
	print("Connected with result code "+str(rc))
	client.subscribe("led1")
	client.subscribe("led2")
	client.subscribe("led3")
	client.subscribe("takePicture")
	client.subscribe("relay")
	client.subscribe("online")
	client.subscribe("display")
	client.subscribe("led1_status")
	client.subscribe("led2_status")
	client.subscribe("led3_status")
	client.subscribe("relay_status")
	client.subscribe("display_status")

	client.subscribe("load_status")

	client.subscribe("temp")
	client.subscribe("hum")
	client.subscribe("range")
	client.subscribe("motion")

def on_message(client, userdata, msg):
	global led1_status
	global led2_status
	global led3_status
	global relay_status
	global display_status

	#print(msg.topic+" "+str(msg.payload))
	if msg.topic=="load_status":
		if str(msg.payload)=="true":
			print('led1:' + str(led1_status))
			print('led2:' + str(led2_status))
			print('led3:' + str(led3_status))
			client.publish("led1_status", getStatusBool(led1_status))
			client.publish("led2_status", getStatusBool(led2_status))
			client.publish("led3_status", getStatusBool(led3_status))
			client.publish("relay_status", getStatusBool(led3_status))
			client.publish("display_status", display_status)


	if msg.topic=="led1":
		ok=grovepi.digitalRead(led1)
		time.sleep(1.5)
		if str(msg.payload)=="true" :

			if str(ok)=="0":
				grovepi.digitalWrite(led1,1)
			if str(ok)=="1":
				grovepi.digitalWrite(led1,1)
			else:
				grovepi.digitalWrite(led1,1)

			time.sleep(0.5)
			client.publish("led1_status", 1)
			led1_status=True

		if str(msg.payload)=="false":

			if str(ok)=="0":
				grovepi.digitalWrite(led1,0)
			if str(ok)=="1":
				grovepi.digitalWrite(led1,0)
			else:
				grovepi.digitalWrite(led1,0)

			time.sleep(0.8)
			client.publish("led1_status", 0)
			led1_status=False

	if msg.topic=="led2":
		ok=grovepi.digitalRead(led2)
		time.sleep(1.5)
		if str(msg.payload)=="true":

			if str(ok)=="0":
				grovepi.digitalWrite(led2,1)
			if str(ok)=="1":
				grovepi.digitalWrite(led2,1)
			else:
				grovepi.digitalWrite(led2,1)

			time.sleep(0.5)
			client.publish("led2_status", 1)
			led2_status=True

		if str(msg.payload)=="false":

			if str(ok)=="0":
				grovepi.digitalWrite(led2,0)
			if str(ok)=="1":
				grovepi.digitalWrite(led2,0)
			else:
				grovepi.digitalWrite(led2,0)

			time.sleep(0.8)
			client.publish("led2_status", 0)
			led2_status=False


	if msg.topic=="led3":
		ok=grovepi.digitalRead(led3)
		time.sleep(1.5)
		if str(msg.payload)=="true":

			if str(ok)=="0":
				grovepi.digitalWrite(led3,1)
			if str(ok)=="1":
				grovepi.digitalWrite(led3,1)
			else:
				grovepi.digitalWrite(led3,1)

			time.sleep(0.8)
			client.publish("led3_status", 1)
			led3_status=True

		if str(msg.payload)=="false":

			if str(ok)=="0":
				grovepi.digitalWrite(led3,0)
			if str(ok)=="1":
				grovepi.digitalWrite(led3,0)
			else:
				grovepi.digitalWrite(led3,0)

			time.sleep(0.8)
			client.publish("led3_status", 0)
			led3_status=False


	if msg.topic=="display":
		if str(msg.payload)=="":
			global canEdit
			canEdit=True
		else:
			global canEdit
			canEdit=False
			lcd.setText(str(msg.payload))
			display_status=str(msg.payload)
			client.publish("display_status", str(msg.payload))
		time.sleep(0.5)


	if msg.topic=="relay":
		ok=grovepi.digitalRead(relay)
		time.sleep(1.5)
		if str(msg.payload)=="true":

			if str(ok)=="0":
				grovepi.digitalWrite(relay,1)
			if str(ok)=="1":
				grovepi.digitalWrite(relay,1)
			else:
				grovepi.digitalWrite(relay,1)

			time.sleep(0.8)
			client.publish("relay_status", 1)
			relay_status=True


def init():
	global started
	global client
	client.on_connect = on_connect
	client.on_message = on_message
	client.connect_async("raspberrypi.local", 1883, 60)
	client.loop_start()

	# INIT
	time.sleep(0.50)
	grovepi.digitalWrite(led1,0)
	time.sleep(0.50)
	grovepi.digitalWrite(led2,0)
	time.sleep(0.50)
	grovepi.digitalWrite(led3,0)
	time.sleep(0.50)
	grovepi.digitalWrite(buzzer,0)
	time.sleep(0.50)
	grovepi.digitalWrite(relay,0)
	time.sleep(0.50)
	client.publish("led1_status", 0)
	client.publish("led2_status", 0)
	client.publish("led3_status", 0)
	client.publish("relay_status", 0)
	client.publish("display_status", "")
	client.publish("online", 1)
	time.sleep(2)


	lcd.setRGB(0,0,0)
	lcd.setText("IOT-DEVICE \nSTARTING")
	time.sleep(1)
	lcd.setRGB(100,100,100)
	lcd.setText("LOADING ... ")

	print("\n\nIOT is online\n\n")
	started=True

def exit():
	

	time.sleep(0.50)
	grovepi.digitalWrite(led1,0)
	time.sleep(0.50)
	grovepi.digitalWrite(led2,0)
	time.sleep(0.50)
	grovepi.digitalWrite(led3,0)
	time.sleep(0.50)
	grovepi.digitalWrite(buzzer,0)
	time.sleep(0.50)
	grovepi.digitalWrite(relay,0)
	time.sleep(0.50)
	client.publish("online", 0)
	client.publish("led1_status", 0)
	client.publish("led2_status", 0)
	client.publish("led3_status", 0)
	client.publish("relay_status", 0)
	client.publish("display_status", "")
	

	lcd.setRGB(100,100,100)
	lcd.setText("IOT-DEVICE \nSTOPPING")
	time.sleep(1)
	lcd.setRGB(0,0,0)
	lcd.setText("")
	time.sleep(0.50)
	

def ultrasonicF():
	time.sleep(0.50)
	try:
		#ultrasonic
		range= int(grovepi.ultrasonicRead(ultrasonic_ranger))
		#int(str(range) + " cm")

		if range<=500:
			client.publish("range", str(range))
			

	except (IOError,TypeError) as ex:
		error="Error: " + str(ex)
		#print(error)


def tempF():
	time.sleep(0.5)
	try:
		#temperatuur en humindity

		[temp,hum] = grovepi.dht(temphum,0)
		if math.isnan(temp)==False and math.isnan(hum)==False:
			if canEdit==True:
				lcd.setText("Temp:" + str(temp) + "C\n" + "Hum:" + str(hum) + " %")

				global isNight
				isNight=in_between(datetime.datetime.now().time(), datetime.time(23, 0, 0), datetime.time(4, 0, 0))

				if isNight==True:
					lcd.setRGB(0,0,0)
				else:
					lcd.setRGB(100,100,100)
				
				display_status=""
			client.publish("temp", temp)
			client.publish("hum", hum)
			print('temperatuur: ' + temp)


	except (IOError,TypeError) as ex:
		error="Error: " + str(ex)

		#print(error)

def switchF():
	time.sleep(1)
	try:
		#switch turn on/off
		pressed =(grovepi.digitalRead(switch))
		if pressed==True:
			#grovepi.digitalWrite(led1,1)
			time.sleep(0.20)
			client.publish("relay_status", 1)
			grovepi.digitalWrite(relay,1)

		if pressed==False:
			#grovepi.digitalWrite(led1,0)
			time.sleep(0.20)
			client.publish("relay_status", 0)
			grovepi.digitalWrite(relay,0)


	except (IOError,TypeError) as ex:
		error="Error: " + str(ex)
		#print(error)

def buttonF():
	time.sleep(0.10)
	try:
		#switch turn on/off
		pressed =(grovepi.digitalRead(button))
		if pressed==True:
			#grovepi.digitalWrite(led1,1)
			time.sleep(0.20)
			client.publish("takePicture", 1)
			client.publish("motion", 1)


	except (IOError,TypeError) as ex:
		error="Error: " + str(ex)
		#print(error)

def motion():
	time.sleep(0.22)
	try:
		if grovepi.digitalRead(pir_sensor):
			global canEdit
			if canEdit==True:
				lcd.setText("Welkom thuis")
				global isNight
				isNight
				if isNight==True:
					lcd.setRGB(0,0,0)
				else:
					lcd.setRGB(100,100,100)

				display_status=""
			client.publish("motion", 1)

			#time.sleep(5)
		else:
			client.publish("motion", 0)
 
	except (IOError,TypeError) as ex:
		error="Error: " + str(ex)
		print(error)

def main():
	init()
	global started
	if started==True:
		print("Switch started")
		print("ultrasonic started")
		print("Temp started")
		started=False



	while True:
		buttonF()
		switchF()
		ultrasonicF()
		tempF()
		motion()


def lcd_f():
	global started

	

	#executor = ProcessPoolExecutor(3)
	#loop = trollius.get_event_loop()
	#_temp = trollius.async(loop.run_in_executor(executor, tempF))

	#loop.run_forever()




if __name__ == '__main__':

	try:

		executor = ProcessPoolExecutor(2)
		loop = trollius.get_event_loop()
		_lcd_f = trollius.async(loop.run_in_executor(executor, lcd_f))
		_main = trollius.async(loop.run_in_executor(executor, main))


		loop.run_forever()
	except (TypeError) as ex:
		error="Error: " + str(ex)
		#print(error)
	except (KeyboardInterrupt):
		exit()
		print("\n\nIOT is afgesloten\n\n")
		sys.exit(0)
	except (SystemExit):
		print("\n\nIOT is geforceert afgelosten\n\n")
		print("\n\nOFF\n\n")
