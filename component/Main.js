import React, {useState, useRef} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import FormInput from './FormInput';

const {width, height} = Dimensions.get('screen');
const Main = () => {
  const [url, setUrl] = useState(
    'https://data.canabolabs.com/PWA/PWATest1.JSON',
  );
  const [urlArray, seturlArray] = useState([]);

  const [result, setResult] = useState({});

  //   const deviceModel = getUniqueId;
  //   const deviceIP = DeviceInfo.getIPAddress();
  //   const deviceMAC = DeviceInfo.getMacAddress();
  //   console.log('Device MAC Address: ', deviceMAC);
  //   console.log('Device IP Address: ', deviceIP);
  //   console.log('Device model:', deviceModel);

  const [certInfo, setCertInfo] = useState(258744149807898);
  const [surfing, setSurfing] = useState(false);

  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  floatButtonHandler = () => {
    console.log('sendurl===>', url);

    const newUrlArray = [...urlArray];
    newUrlArray.push(url + '?ID=' + certInfo);
    seturlArray(newUrlArray);

    axios
      .get(url)
      .then(response => {
        response.data = {
          'JSON-VERSION': 23.1,
          command: 'display-on-screen',
          'url-to-display-upon': 'https://tinyurl.com/123',
          screen: 'landscape',
          elements: {
            text1: {
              type: 'text label',
              'top-left-location': '10,10',
              Xsize: '12',
              Ysize: '12',
              font: 'sans-serif.ttf',
              color: 'black',
              text: 'this is a PWA test #1',
            },
            button1: {
              type: 'button',
              'top-left-location': '90,90',
              Xsize: '10',
              Ysize: '10',
              'idle-Image': 'data.canabolabs.com/PWA/b2.gif',
              'click-Image': 'data.canabolabs.com/PWA/b1.gif',
              url2Open: 'https://tinyurl.com/PWAJumpTest1',
            },
            button2: {
              type: 'button',
              'top-left-location': '90,75',
              Xsize: '10',
              Ysize: '10',
              'idle-Image': 'data.canabolabs.com/PWA/b2.gif',
              'click-Image': 'data.canabolabs.com/PWA/b1.gif',
              url2Open: 'tinyurl.com/PWAJumpTest2',
            },
            hotspot1: {
              type: 'hotspot',
              'top-left-location': '50,50',
              Xsize: '20',
              color: '#b43757',
              Ysize: '20',
              url2Open: 'tinyurl.com/PWADomainTest3',
            },
          },
        };

        setResult(response.data);
        if (response.data.command == 'display-on-screen') {
          // if (response.data.screen == "portrait") {
          //   Orientation.lockToPortrait();
          // }
          // if (response.data.screen == "landscape") {
          //   Orientation.lockToLandscape();
          // }
        }

        if (response.data.command == 'send-log-activty') {
          setUrl(response.data.url2send);
        }

        if (response.data.command == 'simulate-clicks') {
          // if (response.data.screen == "portrait") {
          //   Orientation.lockToPortrait();
          // }
          // if (response.data.screen == "landscape") {
          //   Orientation.lockToLandscape();
          // }
        }
        setSurfing(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  backButtonHandler = () => {
    setSurfing(false);
    setResult({});
  };

  pressButton = logUrl => {
    sendlogActivity(logUrl);
  };

  sendlogActivity = logUrl => {
    axios
      .get(url + '?ID=' + 258744149807898, {
        command: 'send-log-activty',
        url2send: logUrl,
      })
      .then(response => {
        setResult(response.data);
        if (response.data.command == 'display-on-screen') {
          setSurfing(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderElement = element => {
    switch (element.type) {
      case 'button':
        return (
          <TouchableOpacity onPress={() => pressButton(element.url2Open)}>
            <Image
              source={{
                uri:
                  element['idle-Image'].indexOf('https://') > -1
                    ? element['idle-Image']
                    : 'https://' + element['idle-Image'],
              }}
              style={{
                width: (width / 100) * parseInt(element.Xsize),
                height: (height / 100) * parseInt(element.Ysize),
                position: 'absolute',
                zIndex: 10,
                top:
                  (height / 100) *
                  parseInt(element['top-left-location'].split(',')[1]),
                left:
                  (width / 100) *
                  parseInt(element['top-left-location'].split(',')[0]),
              }}
            />
          </TouchableOpacity>
        );
      case 'hotspot':
        return (
          <TouchableOpacity onPress={() => pressButton(element.url2Open)}>
            <View
              style={{
                width: (width / 100) * parseInt(element.Xsize),
                height: (height / 100) * parseInt(element.Ysize),
                zIndex: 10,
                position: 'absolute',

                top:
                  (height / 100) *
                  parseInt(element['top-left-location'].split(',')[1]),
                left:
                  (width / 100) *
                  parseInt(element['top-left-location'].split(',')[0]),
              }}
            />
          </TouchableOpacity>
        );
      case 'text label':
        return (
          <Text
            style={{
              position: 'absolute',
              top:
                (height / 100) *
                parseInt(element['top-left-location'].split(',')[1]),
              left:
                (width / 100) *
                parseInt(element['top-left-location'].split(',')[0]),
              color: element.color,
              zIndex: 10,
              fontFamily: element.font.replace(/\.ttf/g, ''),
            }}>
            {element.text}
          </Text>
        );
      default:
        return null;
    }
  };

  // ------------------- Start simulate ----------------------//
  const SimulateClick = ({positionOnScreen, secondsWaitAfterClick}) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: positionOnScreen.split(',')[0],
          left: positionOnScreen.split(',')[1],
        }}>
        <Text>Simulate Click</Text>
      </View>
    );
  };

  const SimulateDoubleClick = ({positionOnScreen, secondsWaitAfterClick}) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: positionOnScreen.split(',')[0],
          left: positionOnScreen.split(',')[1],
        }}>
        <Text>Simulate Double Click</Text>
      </View>
    );
  };

  const SimulateText = ({
    positionOnScreen,
    textToEnter,
    secondsWaitAfterClick,
  }) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: positionOnScreen.split(',')[0],
          left: positionOnScreen.split(',')[1],
        }}>
        <Text>Simulate Text: {textToEnter}</Text>
      </View>
    );
  };

  const Simulation = ({simulate}) => {
    const {type} = simulate;

    switch (type) {
      case 'click':
        return <SimulateClick {...simulate} />;
      case 'double-click':
        return <SimulateDoubleClick {...simulate} />;
      case 'text':
        return <SimulateText {...simulate} />;
      default:
        return null;
    }
  };

  const SimulationSet = ({simulateSet}) => {
    return Object.values(simulateSet).map((simulate, index) => (
      <Simulation key={index} simulate={simulate} />
    ));
  };

  // -------------------End simulate ----------------------//

  function renderItem({item}) {
    return (
      <View style={styles.item}>
        <Text>{item}</Text>
      </View>
    );
  }

  return surfing ? (
    <>
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
          {/* <WebView
            style={styles.flexContainer}
            source={{uri: result['url-to-display-upon']}}
            // startInLoadingState={true}
            // renderLoading={() => (
            //   <ActivityIndicator
            //     color="black"
            //     size="large"
            //     style={styles.flexContaainer}
            //   />
            // )}
            // ref={webviewRef}
            // onNavigationStateChange={(navState) => {
            //   // setCanGoBack(navState.canGoBack);
            //   // setCanGoForward(navState.canGoForward);
            //   // setCurrentUrl(navState.url);
            // }}
          /> */}
          {result.elements &&
            Object.values(result.elements).map((element, index) => {
              return (
                <React.Fragment key={index}>
                  {renderElement(element)}
                </React.Fragment>
              );
            })}

          {result.simulateSet && (
            <SimulationSet simulateSet={result.simulateSet} />
          )}
        </View>

        <TouchableOpacity
          onPress={backButtonHandler}
          style={styles.tabBarContainerBack}>
          <Text style={styles.button}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  ) : (
    <>
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.formContainer}>
          <FormInput
            labelName="url: https://..."
            value={url}
            autoCapitalize="none"
            defaultValue="https://data.canabolabs.com/PWA/PWATest1.JSON"
            onChangeText={url => setUrl(url)}
          />

          <Text
            style={{
              marginTop: 10,
              marginBottom: 10,
              fontSize: 14,
            }}>
            {/* ID:{JSON.stringify(certInfo)}{" "} */}
            Current_url: {url + '?ID=' + certInfo}
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 30,
            }}>
            {/* ID:{JSON.stringify(certInfo)}{" "} */}
            ID: {certInfo}
          </Text>

          <Text>Floating logs:</Text>
          <FlatList
            data={urlArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TouchableOpacity
          onPress={floatButtonHandler}
          style={styles.tabBarContainer}>
          <Text style={styles.button}>Floating</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    marginTop: -20,
    flex: 1,
  },
  formContainer: {
    padding: 10,
    paddingTop: '30%',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#b43757',
  },
  tabBarContainerBack: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#b43757',
  },
  button: {
    color: 'white',
    fontSize: 24,
  },
  buttonback: {
    color: 'white',
    fontSize: 24,
  },
  item: {
    padding: 5,
    fontSize: 18,
    height: 44,
  },
});

export default Main;
