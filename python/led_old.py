#!/usr/bin/env python

import time
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import grovepi

# CONNECTORS
led = 4
switch = 3
buzzer = 8
sensor = 7

# PINMODES
grovepi.pinMode(led,"OUTPUT")
grovepi.pinMode(switch,"INPUT")


client = mqtt.Client()
client.connect("raspberrypi.local", 1883, 60)

#subscribe
client.subscribe("led")
client.subscribe("temp")
client.subscribe("hum")


#client.unsubscribe("led")
#client.publish("led", "aan")

# LOOP

while True:

    try:
        [temp,hum] = grovepi.dht(sensor,0)
        client.publish("temp", temp)
        client.publish("hum", hum)
    	pressed =(grovepi.digitalRead(switch))
	if pressed==True:
	    grovepi.digitalWrite(led,1)
	    grovepi.digitalWrite(buzzer,1)

	else:
	    grovepi.digitalWrite(led,0)
	    grovepi.digitalWrite(buzzer,0)


    except (IOError,TypeError) as e:
        print ("Error")
