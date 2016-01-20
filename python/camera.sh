#!/bin/bash
cd /usr/src/mjpg-streamer/mjpg-streamer-experimental
export LD_LIBRARY_PATH=.
./mjpg_streamer -o "output_http.so -w ./www" -i "input_raspicam.so -x 720 -y 480 -fps 60 -ex night -rot 180 -vs"