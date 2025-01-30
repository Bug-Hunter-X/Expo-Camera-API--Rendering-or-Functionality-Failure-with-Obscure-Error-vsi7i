This solution involves checking for available camera capabilities before configuring the camera.  It also uses a fallback mechanism in case the requested capabilities are not available.  This approach prevents crashes and ensures the app gracefully handles situations where the device doesn't support the desired camera settings.
```javascript
import * as Camera from 'expo-camera';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [availableCapabilities, setAvailableCapabilities] = useState({});

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if(status === 'granted') {
          const capabilities = await cameraRef.getAvailableCameraCapabilitiesAsync();
          setAvailableCapabilities(capabilities);
      }
    })();
  }, []);

  const handleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View><Text>Requesting permissions...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  const supportedResolution = availableCapabilities.supportedResolutions && availableCapabilities.supportedResolutions.find(res => res.width >= 1280 && res.height >= 720);
  
  const resolution = supportedResolution || availableCapabilities.standardResolution;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={ref => setCameraRef(ref)}
        resolution={resolution}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCameraType}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
```