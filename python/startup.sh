#! /bin/sh
# /etc/init.d/startup
#
# Carry out specific functions when asked to by the system
case "$1" in
  start)
	
    sudo screen -X -S mqtt quit
    sudo screen -X -S startup quit
    sudo screen -X -S python quit
    sudo screen -X -S camera quit
	
    echo "Starting server ... "
    sudo screen -d -m -S "startup" "/srv/python/start.sh"
    sudo screen -d -m -S "camera" "/srv/python/camera.sh"
    sudo screen -d -m -S "mqtt" "/srv/mqtt/bin/run.sh"
    sleep 40
    sudo screen -d -m -S "python" "/srv/python/run.sh"
    echo "Server started"
    sleep 5
    sudo screen -X -S startup quit
   ;;
  stop)
    sudo screen -X -S mqtt quit
    sudo screen -X -S startup quit
    sudo screen -X -S python quit
    sudo screen -X -S camera quit
    echo "Server stopped"
    ;;
  *)
    echo "Usage: /etc/init.d/startup {start|stop}"
    exit 1
    ;;
esac

exit 0

