import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ImageBackground,Image,Button,TextInput} from 'react-native';
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

function HomeScreen(props)
{
  return (
    <View style={styles.container}>
      <ImageBackground
      source={background}
      style = {styles.background}
      blurRadius='2'
      >
      <Text style={styles.text1}>Travel Hub</Text>
      <Image source={require("./assets/plane.png")}
      style={{width:100,height:100}}/>
      
      {/* style={{width:100,height:100}}/> */}
      <Button
        title="Search Flight"
        onPress={()=>props.navigation.navigate('FlightSearch')}
      />
      
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );

}



function SecondScreen(props)
{
var dt = new Date();
const [date,setDate] = useState();
const[oneway,setOneway] = useState(false);
const[twoway,setTwoway] = useState(false);
const [sourcelocation, setSLocation] = useState("")
const [destinationlocation, setDLocation] = useState("")
const [npass, setNpass] = useState(0)
// const [scity, setScity] = useState('')
// const [dcity,setDcity] = useState('')
// const [nopassengers,setNop] = useState(0)

const getFlights = (scity,dcity,nopassengers)=>{
  const URL = baseURL + "itinerary_type=ONE_WAY&class_type=ECO" + "&location_arrival=" + scity + "&location_departure=" + dcity + "&number_of_passengers=" + nopassengers + "&date_departure=2022-11-15" + "&sort_order=PRICE"
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f892f0570amsh0888b19e7ff4f1cp1ac3b7jsn4810c1d92686',
      'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
    }
  };
  
  fetch(URL, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

const OneWayflight =()=>{
  setOneway(true);
  setTwoway(false);
}
const TwoWayflight =()=>{
  setOneway(false);
  setTwoway(true);
}
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    setDate(date);
    hideDatePicker();
  };

  return(
    <View style={styles.container}>
      <ImageBackground
      source={background}
      style = {styles.background}
      blurRadius='2'
      >
      <Text style={styles.text2}>Travel Hub</Text>
      <TextInput style={styles.input}
          placeholder="Source:"
          placeholderTextColor='black'
          onChangeText={(value)=>setSLocation(value)}
          value={sourcelocation}
        />
        <TextInput style={styles.input}
          placeholder="Destination:"
          placeholderTextColor="black"
          onChangeText={(value)=>setDLocation(value)}
          value={destinationlocation}
        />
        <View style={styles.check}>
        <CheckBox 
        containerStyle ={{backgroundColor: 'transparent', marginBottom:15}}
        textStyle={{color:'white'}}
        title="Oneway"
        checked={oneway}
        checkedIcon="dot-circle-o"
        uncheckedIcon = "circle-o"
        onPress={OneWayflight}
  
        />
        <CheckBox 
        containerStyle ={{backgroundColor: 'transparent',marginBottom:25}}
        textStyle={{color:'white'}}
        // style={{
        //   width: 20,
        //   height: 20,
        // }}
        title="RoundTrip"
        checked={twoway}
        checkedIcon="dot-circle-o"
        uncheckedIcon = "circle-o"
        onPress={TwoWayflight}
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
          onChangeText={(value)=>setNpass(value)}
          value={npass}
        />
        <Button
        title="Search"
        onPress={()=>getFlights(sourcelocation,destinationlocation,npass)}
      />
      

</ImageBackground>
    </View>
  )
}

function ThirdScreen(props){
  return(
    <Text>results</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1:{
    fontSize:50
  },
  background:{
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  },input:{
    backgroundColor:'white',
    padding:10,
    borderRadius:10,
    borderWidth:1,
    width:"90%",
    marginBottom:35,
    },text2:{
    fontSize:30
  },check:{
    flexDirection:'row',
    marginBottom:35,
  },nooftravellers:{
    backgroundColor:'white',
    padding:10,
    borderRadius:10,
    borderWidth:1,
    width:"40%",
    marginBottom:35,
  },calender:{
  marginBottom:35,
  }
});
