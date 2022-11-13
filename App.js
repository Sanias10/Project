import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Image, Button, TextInput, FlatList, Platform, TouchableOpacity } from 'react-native';
import background from "./assets/flight.png"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState,useEffect } from "react";
// import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker';
// import { render } from 'react-dom';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker,Callout} from 'react-native-maps'
import * as Location from 'expo-location'



// const API_KEY = "f892f0570amsh0888b19e7ff4f1cp1ac3b7jsn4810c1d92686"
const baseURL = 'https://priceline-com-provider.p.rapidapi.com/v1/flights/search?'

const newbaseURL = 'https://airlabs.co/api/v9/nearby?lat=39.7684&lng=-86.1581&distance=80&api_key=f817a168-7182-4b35-8945-c1a282ec19a6' 

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
         <Stack.Screen
          name="NearbyAirports"
          component={FourthScreen}
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
        // blurRadius='2'
      >
        <Text style={styles.text1}>Travel Hub</Text>
        <Image source={require("./assets/plane.png")}
          style={{ width: 100, height: 100 }} />

        {/* style={{width:100,height:100}}/> */}
        {/* <Button
          title="Search Flight"
          onPress={() => props.navigation.navigate('FlightSearch')}
        /> */}
        <TouchableOpacity
        style={styles.searchbutton}
        onPress={() => props.navigation.navigate('FlightSearch')}>
          <Text style={{fontSize:25}}>Search Flight</Text>
        </TouchableOpacity>

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );

}



function SecondScreen(props) {
  var dt = new Date();
  const [date, setDate] = useState("");
  const [itineraryType, setFlightType] = useState('ONE_WAY');
  const [sourcelocation, setSLocation] = useState("")
  const [destinationlocation, setDLocation] = useState("")
  const [npass, setNpass] = useState(0)
  const [airportObject, setairportObject] = useState("")
  // const [scity, setScity] = useState('')
  // const [dcity,setDcity] = useState('')
  // const [nopassengers,setNop] = useState(0)


  const getFlights = (itineraryType, scity, dcity, nopassengers, date) => {
    const URL = baseURL + "itinerary_type=" + itineraryType + "&class_type=ECO" + "&location_arrival=" + dcity + "&location_departure=" + scity + "&number_of_passengers=" + nopassengers + "&date_departure=" + date + "&sort_order=PRICE" + "&number_of_stops=1"
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f892f0570amsh0888b19e7ff4f1cp1ac3b7jsn4810c1d92686',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
    fetch(URL, options)
      .then(response => response.json())
      .then(response => props.navigation.navigate('Results', { flightData: response, source: scity, destination:dcity, npass:npass }))
      .catch(err => console.error(err));
  }

  const setItineraryType = (type) => {
    setFlightType(type)
  }

  const nearbyAirport = ()=>{
    fetch(newbaseURL)
    .then(response => response.json())
    .then(results =>{
      // setairportObject(results.response.airports)
      props.navigation.navigate('NearbyAirports', { 'airportData':results.response.airports})
    })
    //props.navigation.navigate('NearbyAirports', { 'airportData':airportObject})
   
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

  // console.log('aaa',npass);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.background}
        // blurRadius='2'
      >
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text2}>Travel Hub</Text>
          <Image source={require("./assets/plane.png")}
          style={{ width: 80, height: 80}} />
        </View>
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
            title="RoundTrip"
            checked={itineraryType == 'ROUND_TRIP'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => setItineraryType('ROUND_TRIP')}
          />
        </View>

        <View style={styles.calender}>
          <Button title={`Select Departure Date: (${date})`} onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            textColor={'#000'}
          />
        </View>
        <TextInput style={styles.nooftravellers}
          placeholder="No of passengers:"
          placeholderTextColor='black'
          onChangeText={(value) => setNpass(value)}
          value={npass}
        />
        <Button
          title="Search"
      //     onPress={() => {if (itineraryType!=" " && sourcelocation!="" && destinationlocation!="" && npass>0 && date!="")
      //     getFlights(itineraryType, sourcelocation, destinationlocation, npass, date)
      //   else{
      //     alert('All the fields are required')
      //   }

      // }}
        
        onPress={()=> {if (itineraryType!=" " && sourcelocation!="" && destinationlocation!="" && npass>0 && date!="")
        getFlights(itineraryType, sourcelocation, destinationlocation, npass, date)
        else if(sourcelocation == "" ) {
          alert("Enter Required Fields")
        }
        else if(destinationlocation == "") {
          alert("Enter Destination Location")
        }
        else if(npass <= 0) {
          alert("Enter number of passengers")
        }
        
        else if(date == "") {
          alert("Select a Date")
        }
       
      }
    }
        />

        <Button title = "Nearby Airports" onPress={() => nearbyAirport()} />

      </ImageBackground>
    </View>
  )
}


function ThirdScreen({ route, navigation }) {
  const [flightData, setFlighData] = useState(route.params.flightData);
  const [sourceCity, setSourceCity] = useState(route.params.source);
  const [destinationCity,setDestinationCity] = useState(route.params.destination)
  const [npass,setNpass] = useState(route.params.npass)

  const getAirlineName = (airlineCode) => {
    let index = flightData.airline.findIndex(obj => obj.code === airlineCode);
    if (index > -1) {
      let airlineData = flightData.airline[index];
      return airlineData.name
    }
    return ''
  }

  const getFlightPrice =(airlineCode)=>{
    let index = flightData.pricedItinerary.findIndex(obj=> obj?.pricingInfo?.ticketingAirline==airlineCode);
    if (index>-1){
      let price = flightData.pricedItinerary[index]?.pricingInfo?.totalFare;
      return price
    }else{
      return ''
    }
  }

  if (!flightData) {
    return (
      <Text>NO FLights Available</Text>
    )
  }
  else {
    // console.log('pricedItinerary-----------',flightData.pricedItinerary);
    return (
      <View>
        <FlatList
          renderItem={({ item, index }) => <FlightDetailsCell data={item}  source={sourceCity} npass={npass} destination={destinationCity} getAirlineName={getAirlineName} getFlightPrice={getFlightPrice}/>}
          data={flightData?.segment}   
        />
      </View>
    )
  }
}

function FlightDetailsCell(props) {
  const { data, source, destination, npass, getAirlineName ,getFlightPrice} = props;
  const airlineName = getAirlineName(data.marketingAirline);
  const price = getFlightPrice(data.marketingAirline);
  const initials = airlineName.split(" ").map((n)=>n[0]).join("");
  
  if (source === data.origAirport && destination === data.destAirport)
    return (
      <View style={{ paddingHorizontal: 15,paddingVertical:20, margin: 10, backgroundColor: '#b0c4de' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{flex:1}}>
            <Text style={{fontSize:20, fontWeight:'900'}}>{airlineName} <Ionicons name = 'ios-airplane' size={30}></Ionicons></Text>
            <Text style={{fontSize:18,fontWeight:'500'}}>Source: {data.origAirport}</Text>  
            <Text style={{fontSize:18,fontWeight:'500'}}>Destination : {data.destAirport}</Text>
            <Text style={{fontSize:18,fontWeight:'500'}}>Duration : {data.duration} minutes</Text>
            <Text style={{fontSize:18,fontWeight:'500'}}>Departure Time: {moment(data.departDateTime).format('LLL')}</Text>
            <Text style={{fontSize:18,fontWeight:'500'}}>Arrival Time: {moment(data.arrivalDateTime).format('LLL')}</Text>
            <Text style={{fontSize:18,fontWeight:'500'}}>Total Fare:{price ? '$':''} {price*npass}</Text>
          </View>
          <View style={{ height: 40, width: 40, backgroundColor: '#d3d3d3',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:18}}>{initials}</Text></View>
        </View>


      </View>
    )
}

function FourthScreen({route}){
    
  return(
    <View style={styles.container}>
      <FlatList
        data = {route.params.airportData}
        renderItem = {({item})=>
        <Airport
          name = {item?.name}
          cc = {item?.iata_code}
        />  
      }
      keyExtractor = {(item,index)=>index.toString()}
      />
    </View>
  )
  
}

function Airport(props){

  return(
    <View style={styles.panel}>
      <Text style={styles.text}>{props.name}</Text>
      <Text style={styles.text}>{props.cc}</Text>
    </View>)
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
    fontSize: 40,
    margin: 25,
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
  }, text:{
    fontSize: 40,
    margin: 25,
  },panel :{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 250,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 3,
    marginHorizontal: 5,
  },
});
