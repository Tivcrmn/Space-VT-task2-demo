# Space@VT task2 demo by Tivcrmn

## Analyzing Interplanetary Magnetic Field (IMF) data from OMNI. from 2011 to 2017

IMF is the Sun’s magnetic field carried by the solarwind into the interplanetary space. 
IMF plays an important role in transferring energy into the Earth’s atmosphere and generating the northern lights (aurora). 
IMF data is available for download from NASA’s OMNI database. 

Students can work on a variety of demo projects using IMF. 

For example: 

1. develop a real time IMF monitoring tool. 
2. develop visualizations of IMF data.

The features which have been finished

 - Show a certain element in the canvas in some days based on hour
 - Show a certain element in the canvas in some months based on day (the number is avg, max or min of the day)
 - Show a certain element in the canvas in some years based on day or month (the number is avg, max or min of the day or month)


### IMF data in MongoDB documents 

```json
{
    "_id" : ObjectId("5a98c57828280a0e510bbeff"),
    "Year" : 2017,
    "DecimalDay" : 1,
    "Month" : 1,
    "Hour" : 0,
    "HeliographicInertialLatitudeoftheEarth" : -2.9,
    "HeliographicInertialLongitudeoftheEarth" : 23.5,
    "BR_RTN" : 5.8,
    "BT_RTN" : 0.8,
    "BN_RTN" : -2.4,
    "FieldMagnitudeAverage" : 7.1,
    "BulkFlowspeed" : 551,
    "THETA" : -0.8,
    "PHI" : -4.3,
    "IONDensity" : 6.9,
    "Temperature" : 149703,
    "__v" : 0
}
```
 
[Live Demo](http://tivarea.top/demo/client/index.html)

![](http://oz2vajvam.bkt.clouddn.com/new_space_vt.png)

### Architecture

![](http://oz2vajvam.bkt.clouddn.com/architecture.jpg)