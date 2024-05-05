import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {debounce} from 'lodash';
import * as Progress from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchLocations, fetchWeatherForeCast} from '../api/weather';
const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = loc => {
    console.log('location', loc);
    setLocations([]);
    setShowSearch(false);
    setLoading(true);
    fetchWeatherForeCast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleSearch = value => {
    //fetch location
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        setLocations(data);
      });
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    fetchWeatherForeCast({
      cityName: 'Ho Chi Minh',
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handlerTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const {current, location} = weather;

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require('../assets/img/background.png')}
        style={{position: 'absolute', width: '100%', height: '100%'}}
        resizeMode="cover"
      />
      {loading ? (
        <View style={styles.loading}>
          <Text style={styles.txtLoading}>Loading...</Text>
        </View>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          {/* search section  */}
          <View style={{paddingHorizontal: 16, paddingTop: 16}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: showSearch
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent',
                borderRadius: 20,
                paddingHorizontal: 12,
              }}>
              {showSearch && (
                <TextInput
                  onChangeText={handlerTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor="white"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'white',
                    paddingHorizontal: 6,
                    borderRadius: 20,
                    height: 40,
                  }}
                />
              )}
              <View style={{flex: 1}} />
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 20,
                  padding: 10,
                  right: -10,
                }}
                onPress={() => setShowSearch(!showSearch)}>
                <Image
                  source={require('../assets/img/icSearch.png')}
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
            </View>
            {showSearch && locations.length > 0 && (
              <View style={[styles.locationContainer, {zIndex: 1}]}>
                {locations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.locationItem,
                      index + 1 !== locations.length
                        ? {
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                          }
                        : null,
                    ]}
                    onPress={() => handleLocation(loc)}>
                    <View
                      style={{flexDirection: 'row', alignItems: 'baseline'}}>
                      <Image
                        source={require('../assets/img/pleace.png')}
                        style={{width: 20, height: 20}}
                      />
                      <Text style={{color: 'white', marginLeft: 20}}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* forecast section */}
          <View
            style={{
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: 180,
            }}>
            {/* location */}
            <View style={{flexDirection: 'row', alignItems: 'baseline' , height : 35}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                {location?.name},
              </Text>
              <Text style={{color: 'white', fontSize: 23, fontWeight: '600'}}>
                {'' + location?.country}
              </Text>
            </View>

            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              
              }}>
              {' ' + location?.localtime}
            </Text>

            {/* weather Image */}
            <Image
              source={{uri: 'https:' + current?.condition?.icon}}
              //   source={require('../assets/img/sunandCloud.png')}
              style={{width: 200, height: 200, marginTop: 20}}
            />
            {/* degree celcius */}
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 45,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {current?.temp_c}&#176;
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {current?.condition?.text}
              </Text>
              {/* other stats */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 20,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/img/iconWind.png')}
                    style={{width: 35, height: 35}}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      marginLeft: 5,
                      fontSize: 22,
                    }}>
                    {current?.wind_kph}km
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/img/iconWater.png')}
                    style={{width: 35, height: 35}}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      marginLeft: 5,
                      fontSize: 22,
                    }}>
                    {current?.humidity}%
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/img/iconSun.png')}
                    style={{width: 35, height: 35}}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      marginLeft: 5,
                      fontSize: 22,
                    }}>
                    {location?.localtime
                      ? location.localtime.split(' ')[1]
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Forecast next days */}
          <View style={{marginTop: 260, marginLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
                marginBottom: 3,
              }}>
              <Image source={require('../assets/img/iconCalender.png')} />
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: '600',
                  left: 20,
                }}>
                Daily Forecast
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}>
            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let option = {weekday: 'long'};
              let dayName = date.toLocaleDateString('en-US', option);
              dayName = dayName.split(',')[0];
              return (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    width: 120,
                    height: 160,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 20,
                    marginRight: 10,
                  }}>
                  <Image
                    source={{uri: 'https:' + item?.day?.condition?.icon}}
                    style={{height: 75, width: 75}}
                  />
                  <Text style={{color: 'white'}}>{dayName}</Text>
                  <Text style={{color: 'white', fontSize: 20}}>
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                  <Text style={{color: 'white', fontSize: 13}}>
                    {item?.day?.condition?.text}&#176;
                  </Text>
                  <Text style={{color: 'white', fontSize: 13}}>
                    {item?.date}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    txtLoading : {
        color :'white', 
        fontSize : 30, 
        fontWeight : '700'
    },
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width - 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    top: 74,
    left: 16,
  },
  locationItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
