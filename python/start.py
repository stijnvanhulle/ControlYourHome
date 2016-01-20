#!/usr/bin/env python

import time
import math
import sys
import grovepi
import grove_rgb_lcd as lcd
import socket


# CONNECTORS
led = 4
switch = 3
led2 = 8
buzzer = 5
temphum = 7
ultrasonic_ranger = 6

# PINMODES
#INPUT
grovepi.pinMode(switch,"INPUT")
grovepi.pinMode(temphum,"INPUT")
grovepi.pinMode(ultrasonic_ranger,"INPUT")

#OUTPUT
grovepi.pinMode(led,"OUTPUT")
grovepi.pinMode(led2,"OUTPUT")
grovepi.pinMode(buzzer,"OUTPUT")


def init():

	lcd.setRGB(0,0,0)
	lcd.setText("IOT-DEVICE \nBOOTING")
	time.sleep(5)

	lcd.setRGB(100,100,100)

	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("gmail.com",80))
	text=str(s.getsockname()[0])
	s.close()

	while True:

		lcd.setText("IP: " +str(text))
		time.sleep(0.2)

if __name__ == '__main__':

	try:
		init()
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
