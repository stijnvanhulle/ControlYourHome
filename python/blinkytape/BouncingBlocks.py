# Bounce some blocks up and down the BlinkyTape!
# Created by Matt Dyson (mattdyson.org)
# Version 1.0 (22/12/13)

from BlinkyTapeV2 import BlinkyTape
import time
import random
import math
import glob

# Our base object defining a block
class Block(object):
   def __init__(self,tape,colour=[255,0,0],position=5,direction=1,length=3):
      # The tape we're moving on
      self.tape = tape

      # Colour of the block
      self.colour = colour

      # Length of the block
      self.length = length

      # Every n ticks, we will move
      self.speed = 4
      self.ticksUntilMove = self.speed

      # Direction we're moving (either positive or negative)
      self.direction = direction

      # Position we currently base ourselves off
      self.position = position

   def collision(self, otherBlock):
      self.direction=-self.direction

   def tick(self, allBlocks):
      self.ticksUntilMove-=1
      if self.ticksUntilMove==0:
         self.ticksUntilMove = self.speed
         self.move(allBlocks)

   def move(self, allBlocks):
      for block in allBlocks:
         if self.getColour()==block.getColour(): continue
         if (self.position+self.direction in block.getOccupiedSpaces()) or (self.position+self.length+self.direction in block.getOccupiedSpaces()):
            # We've just hit something
            self.collision(block)
            block.collision(self)

      self.position += self.direction
      if self.position+self.length >= self.tape.getSize() or self.position<=0:
         # We've just hit a wall
         self.direction=-self.direction

   def getOccupiedSpaces(self):
      return range(self.position, self.position+self.length)

   def getColour(self):
      return self.colour

if __name__ == "__main__":
   serialPorts = glob.glob("/dev/ttyACM*")
   port = serialPorts[0]

   bt = BlinkyTape(port)
   blocks = [
     Block(bt,[255,0,0],30,-1,2), # Red block
     Block(bt,[0,0,255],10,-1,5), # Blue block
     Block(bt,[0,255,0],40,1,6) # Green block
   ]

   tickTime = 0.01

   while True:
      # Run a tick on each block
      for block in blocks:
         block.tick(blocks)

      # Once we've ticked all blocks, redraw everything
      # Lets get lazy and set everything to blank first
      for i in range(0,bt.getSize()):
         bt.setPixel(i,0,0,0)
      # Now loop all blocks and get colours
      for block in blocks:
         colour = block.getColour()
         for x in block.getOccupiedSpaces():
            bt.setPixel(x,colour[0],colour[1],colour[2])

      bt.sendUpdate()
      time.sleep(tickTime)
