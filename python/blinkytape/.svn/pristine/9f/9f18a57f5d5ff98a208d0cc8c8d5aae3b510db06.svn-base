# Another Christmas lighting effect for the tech geek!
# Randomly allocate pixels to have a "snowflake" fall on them and then fade out
# Created by Matt Dyson (mattdyson.org)
# Version 1.0 (16/11/14)

import serial
import time
import random
from BlinkyTapeV2 import BlinkyTape

tickLength = 0.05 # Time per 'tick'
maxNewPerTick = 2 # Maximum number of new pixels per tick
maxIntensity = 255 # Maximum intensity of pixel
decayRate = 20 # Decay at this much per tick
length = 60 # Number of positions on tape

if __name__ == "__main__":

  import glob
  import optparse

  parser = optparse.OptionParser()
  parser.add_option("-p", "--port", dest="portname",
                    help="serial port (ex: /dev/ttyUSB0)", default=None)
  (options, args) = parser.parse_args()

  if options.portname != None:
    port = options.portname
  else:
    serialPorts = glob.glob("/dev/ttyACM*")
    port = serialPorts[0]

  bt = BlinkyTape(port)

  # Initialise
  pixels = []
  for i in range(length):
    pixels.append(0)

  while(True):
    # Update current pixels
    for i in range(length):
       if pixels[i]>0:
          pixels[i]-=decayRate

       if pixels[i]<0:
          pixels[i]=0

    # Spawn new pixels
    for n in range(0,random.randint(0, maxNewPerTick)):
       pixels[random.randint(0,length-1)] = maxIntensity

    # Display
    for x in range(length):
      bt.setPixel(x, pixels[x], pixels[x], pixels[x])

    bt.sendUpdate()

    time.sleep(tickLength)
