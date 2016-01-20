# The tech-geek alternative to Christmas lights!
# Choose a random effect from a list, and then play it for a while, before switching
# Created by Matt Dyson (mattdyson.org)
# Version 1.0 (20/12/13)

from __future__ import division
import serial
import time
import math
import random
from BlinkyTapeV2 import BlinkyTape

tickLength = 0.05 # Time per 'tick'
minLength = 15 # Minimum length of particular display
maxLength = 30 # Max length of particular display

def getRunLength():
   length = minLength + (random.random() * (maxLength - minLength))
   print("Running effect for %s seconds" % (length))
   ticksPerSec = (1 / tickLength)
   return int(length * ticksPerSec)

# Scrolling colours with smooth transition
def effect_scroll(blink):
   phase = 0
   for i in range(getRunLength()):
      for i in range(0, blink.getSize()):
         pos = math.radians(i*3) + phase
         redVal = 255 - (math.fabs(math.cos(pos) * 255))
         greenVal = 255 - (math.fabs(math.sin(pos) * 255))
         
         blink.setPixel(i,int(redVal),int(greenVal),0)
      blink.sendUpdate()
      phase += .1
      if phase==1:
         phase = 0   
      time.sleep(tickLength)

# Fade in one colour, then out, then switch colour
def effect_fade(blink):
   level = 5
   direction = 5
   color=1
   for i in range(getRunLength()):
      if color>0:
         blink.displayColor(level,0,0)
      else:
         blink.displayColor(0,level,0)
      level+=direction
      if level>250 or level<6:
         direction=-direction
      if level<6:
         color=-color
      time.sleep(tickLength)


def getTailLength(barLength):
   return 1.5 * barLength

def getBarLength():
   return 3 + int(random.random() * 8)

# Scroll a bars of a certain colour through the other colour
def effect_bars(blink):
   position = 0
   length = getBarLength()
   for x in range(getRunLength()):
      for i in range(0,blink.getSize()):
         setBarIntensity(i,position,length,blink,[250,0,0],[0,250,0])
      blink.sendUpdate()
      position+=1
      time.sleep(tickLength)
      if (position - getTailLength(length))>blink.getSize():
         position=-(length+getTailLength(length))

# Similar to the bars effect, however bounce off either end, and invert the colours
def effect_bounce(blink):
   position = 0
   length = getBarLength()
   direction = 1
   for x in range(getRunLength()):
      for i in range(0,blink.getSize()):
         setBarIntensity(i,position,length,blink,[0,250,0],[250,0,0])
      blink.sendUpdate()
      position+=direction
      time.sleep(tickLength)
      if position+length>blink.getSize() or position<0:
         direction=-direction

def setBarIntensity(led, position, length, blink, colourOn, colourOff):
   tailLength=getTailLength(length)
   if led >= position and led <= (position+length):
      blink.setPixel(led,colourOn[0],colourOn[1],colourOn[2])
   elif led < position and led > position-tailLength:
      # Trailing tail
      intensity = position-led
      colour=[]
      colour.append(int(colourOn[0] * (1/intensity)))
      colour.append(int(colourOn[1] * (1/intensity)))
      colour.append(int(colourOn[2] * (1/intensity)))
      blink.setPixel(led,colour[0],colour[1],colour[2])
   elif led < position+length+tailLength and led > position:
      # Leading tail
      intensity = led-(position+length)
      colour=[]
      colour.append(int(colourOn[0] * (1/intensity)))
      colour.append(int(colourOn[1] * (1/intensity)))
      colour.append(int(colourOn[2] * (1/intensity)))
      blink.setPixel(led,colour[0],colour[1],colour[2])
   else:
      blink.setPixel(led,colourOff[0],colourOff[1],colourOff[2])

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

  effects = [ effect_scroll, effect_fade, effect_bars, effect_bounce ]
  while True:
    chosen = random.choice(effects)
    print("Changing effect to %s" % (chosen.__name__))
    chosen(bt)    
