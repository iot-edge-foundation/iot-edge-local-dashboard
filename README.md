# iotedge-localdashboard

Azure IoT Edge module which ingests routed messages and displays values on a dashboard which is running locally.

To show a dashboard, we need an HTML file loaded from disk. You can provide your own HTML file by using the one in this module as an example.

## port 4242

The local dashboard can be reached at port 4242. Try 'http://localhost:4242' in your favorite browser.

## tempSensor

By default, the [tempSensor example module](https://github.com/Azure/iot-edge-v1/tree/master/v2/samples/azureiotedge-simulated-temperature-sensor) from Microsoft is supported: 'mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0.4'.

Note: this temperature sensor simulation sends only 500 messages in a row by default.

## Routing

Messages mist be routed to input route 'input1'. The same messages are passed through using output route 'output1'.

Use the following routes as an example:

    "sensorToWebNode": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/ld/inputs/input1\")",
    "route": "FROM /messages/modules/ld/outputs/output1 INTO $upstream"
   
## Container Create Options

Use the following create options:

    {
      "ExposedPorts": {
        "4242/tcp": {}
      },
      "HostConfig": {
        "Binds": [
          "c:/iiotedge:/appdata"
        ],
        "PortBindings": {
          "4242/tcp": [
            {
              "HostPort": "4242"
            }
          ]
        }
      }
    }

This makes the port accessible from outside the container.

Note: The portnumber is 'hardcoded'. 

You can change the binding. In this case, the binding name 'appdata' is pointing to the local directory 'c:\iiothedge'. 

Note: The binding name 'appdata' is obligated.

Note: if the file can not be found in the folder provided, the default dashboard is shown.

## Device twin

By default, the module will load the dashboard file named 'index.html'

You can override the filename with this property:

    "fileName": "indexlocal.html"

Note: if the file can not be found, the default dashboard is shown.
