import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Image, Button, TextInput, FlatList } from 'react-native';
import background from "./assets/flight.png"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from "react";
// import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker';
// import { render } from 'react-dom';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const API_KEY = "f892f0570amsh0888b19e7ff4f1cp1ac3b7jsn4810c1d92686"
const baseURL = 'https://priceline-com-provider.p.rapidapi.com/v1/flights/search?'




const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'Home',
            headerStyle: {
              backgroundColor: '#83d1eb',

            },
          }}

        />
        <Stack.Screen
          name="FlightSearch"
          component={SecondScreen}

        />
        <Stack.Screen
          name="Results"
          component={ThirdScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen(props) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.background}
        blurRadius='2'
      >
        <Text style={styles.text1}>Travel Hub</Text>
        <Image source={require("./assets/plane.png")}
          style={{ width: 100, height: 100 }} />

        {/* style={{width:100,height:100}}/> */}
        <Button
          title="Search Flight"
          onPress={() => props.navigation.navigate('FlightSearch')}
        />

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );

}



function SecondScreen(props) {
  var dt = new Date();
  const [date, setDate] = useState();
  const [itineraryType, setFlightType] = useState('ONE_WAY');
  const [sourcelocation, setSLocation] = useState("IND")
  const [destinationlocation, setDLocation] = useState("NYC")
  const [npass, setNpass] = useState('1')
  // const [scity, setScity] = useState('')
  // const [dcity,setDcity] = useState('')
  // const [nopassengers,setNop] = useState(0)

  const getFlights = (itineraryType, scity, dcity, nopassengers, date) => {
    const URL = baseURL + "itinerary_type=" + itineraryType + "&class_type=ECO" + "&location_arrival=" + dcity + "&location_departure=" + scity + "&number_of_passengers=" + nopassengers + "&date_departure=" + date + "&sort_order=PRICE"
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f892f0570amsh0888b19e7ff4f1cp1ac3b7jsn4810c1d92686',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
    fetch(URL, options)
      .then(response => response.json())
      .then(response => props.navigation.navigate('Results', { flightData: response, source: scity }))
      .catch(err => console.error(err));
  }

  const setItineraryType = (type) => {
    setFlightType(type)
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date.toISOString().split('T')[0]);      // YYYY-MM-DD
    hideDatePicker();
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.background}
        blurRadius='2'
      >
        <Text style={styles.text2}>Travel Hub</Text>
        <TextInput style={styles.input}
          placeholder="Source:"
          placeholderTextColor='black'
          onChangeText={(value) => setSLocation(value)}
          value={sourcelocation}
        />
        <TextInput style={styles.input}
          placeholder="Destination:"
          placeholderTextColor="black"
          onChangeText={(value) => setDLocation(value)}
          value={destinationlocation}
        />
        <View style={styles.check}>
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent', marginBottom: 15, borderWidth: 0 }}
            textStyle={{ color: 'white' }}
            title="Oneway"
            checked={itineraryType == 'ONE_WAY'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => setItineraryType('ONE_WAY')}

          />
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent', marginBottom: 25, borderWidth: 0 }}
            textStyle={{ color: 'white' }}
            // style={{
            //   width: 20,
            //   height: 20,
            // }}
            title="RoundTrip"
            checked={itineraryType == 'ROUND_TRIP'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => setItineraryType('ROUND_TRIP')}
          />
        </View>

        <View style={styles.calender}>
          {/* <DatePicker
      date={date}
  maximumDate={new Date()}
  minimumDate={new Date("2021-01-01")}
  mode="date"
  onConfirm={(newDate) => setDate(newDate)}
/> */}
          <Button title={`Show Date Picker (${date})`} onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          {/* <DatePicker
        style={{width: 200}}
        date={date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2016-05-01"
        maxDate="2022-10-26"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
          
        }}
        
        onDateChange={(date) => {setDate({date})}}
      /> */}
          {/* <DatePicker date={date}
        // textStyle={{color:'white'}}
        placeholder = 'Select Date'
        mode='date'
        confirmBtnText = 'Confirm'
        cancelBtnText='Cancel'
        onDateChange={(date)=>{
          setDate(date)
        }}/> */}
        </View>
        <TextInput style={styles.nooftravellers}
          placeholder="No of passengers:"
          placeholderTextColor='black'
          onChangeText={(value) => setNpass(value)}
          value={npass}
        />
        <Button
          title="Search"
          onPress={() => getFlights(itineraryType, sourcelocation, destinationlocation, npass, date)}
        />


      </ImageBackground>
    </View>
  )
}

function ThirdScreen({ route, navigation }) {
  const [flightData, setFlighData] = useState(route.params.flightData);
  const [sourceCity, setSourceCity] = useState(route.params.source);


  const getAirlineName = (airlineCode) => {
    let index = flightData.airline.findIndex(obj => obj.code === airlineCode);
    if (index > -1) {
      let airlineData = flightData.airline[index];
      return airlineData.name
    }
    return ''
  }

  if (!flightData) {
    return (
      <Text>NO FLights Available</Text>
    )
  }
  else {
    return (
      <View>
        <FlatList
          renderItem={({ item, index }) => <FlightDetailsCell data={item} source={sourceCity} getAirlineName={getAirlineName} />}
          data={flightData?.segment}
        />
      </View>
    )
  }
}

function FlightDetailsCell(props) {
  const { data, source, getAirlineName } = props;
  const airlineName = getAirlineName(data.marketingAirline);
  const initials = airlineName.split(" ").map((n)=>n[0]).join("");
  if (source === data.origAirport)
    return (
      <View style={{ padding: 5, margin: 10, backgroundColor: 'grey' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{flex:1}}>
            <Text>Airline: {airlineName}</Text>
            <Text>Source: {data.origAirport}</Text>
            <Text>Destination : {data.destAirport}</Text>
            <Text>Duration : {data.duration} minutes</Text>
            <Text>Departure Time: {moment(data.departDateTime).format('LLL')}</Text>
            <Text>Arrival Time: {moment(data.arrivalDateTime).format('LLL')}</Text>
          </View>
          <View style={{ height: 40, width: 40, backgroundColor: 'red',alignItems:'center',justifyContent:'center' }}><Text>{initials}</Text></View>
        </View>


      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontSize: 50
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }, input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: "90%",
    marginBottom: 35,
  }, text2: {
    fontSize: 30,
    // backgroundColor:'white'
  }, check: {
    flexDirection: 'row',
    marginBottom: 35,
  }, nooftravellers: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: "40%",
    marginBottom: 35,
  }, calender: {
    marginBottom: 35,
  }
});
