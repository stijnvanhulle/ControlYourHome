# Another Christmas lighting effect for the tech geek!
# Randomly allocate pixels to have a "snowflake" fall on them and then fade out
# Created by Matt Dyson (mattdyson.org)
# Version 1.0 (16/11/14)

import serial
import time
import random
from BlinkyTapeV2 import BlinkyTape

if __name__ == "__main__":
	import glob
	import optparse

	parser = optparse.OptionParser()
	parser.add_option("-p", "--port", dest="portname", help="serial port (ex: /dev/ttyUSB0)", default=None)
	(options, args) = parser.parse_args()

	if options.portname != None:
		port = options.portname
	else:
		serialPorts = glob.glob("/dev/ttyACM*")
		port = serialPorts[0]

	bb = BlinkyTape(port)
	pixel=0
	while pixel<bb.getSize():
		bb.setPixel(pixel, 255, 255, 255,True)
		time.sleep(0.02)
		bb.clear()

		print(pixel)
		if pixel==bb.getSize() - 1  :
				while pixel>0:
					pixel=pixel-1
					bb.setPixel(pixel, 255, 255, 255,True)
					time.sleep(0.02)
					bb.clear()
		pixel=pixel+1

		#bb.setPixel(pixel, 100, 100, 100)
		#bb.sendUpdate()
