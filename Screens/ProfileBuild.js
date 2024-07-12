import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileBuild = () => {
  const [pregnancyStatus, setPregnancyStatus] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [numBabies, setNumBabies] = useState('');
  const [birthPlan, setBirthPlan] = useState('');
  const [emergencyPhone1, setEmergencyPhone1] = useState('');
  const [emergencyPhone2, setEmergencyPhone2] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBirthPlanOptions, setShowBirthPlanOptions] = useState(false);
  const [showNumBabiesOptions, setShowNumBabiesOptions] = useState(false); // State for showing number of babies options
  const [selectedBirthPlanOption, setSelectedBirthPlanOption] = useState(null); // Selected birth plan option
  const [selectedNumBabiesOption, setSelectedNumBabiesOption] = useState(null); // Selected number of babies option

  const birthPlanOptions = [
    { id: '1', label: 'Natural Birth' },
    { id: '2', label: 'Cesarean Section' },
    { id: '3', label: 'Home Birth' },
    { id: '4', label: 'Water Birth' },
    { id: '5', label: 'Hospital Birth' },
  ];

  const numBabiesOptions = [
    { id: '1', label: 'Single' },
    { id: '2', label: 'Twins' },
    { id: '3', label: 'More' },
  ];

  const handleSaveProfile = () => {
    if (validateForm()) {
      console.log({
        pregnancyStatus,
        dueDate,
        numBabies: selectedNumBabiesOption?.label || numBabies,
        birthPlan,
        emergencyPhone1,
        emergencyPhone2,
      });
      // Implement save logic here
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  };

  const validateForm = () => {
    if (!pregnancyStatus) {
      return false; // Ensure pregnancy status is selected
    }
    if (pregnancyStatus === 'Pregnancy') {
      return dueDate && (selectedNumBabiesOption || numBabies) && birthPlan && emergencyPhone1 && emergencyPhone2;
    } else {
      return emergencyPhone1 && emergencyPhone2;
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const toggleBirthPlanOptions = () => {
    setShowBirthPlanOptions(!showBirthPlanOptions);
  };

  const selectBirthPlanOption = (option) => {
    setBirthPlan(option.label);
    setSelectedBirthPlanOption(option.label);
    setShowBirthPlanOptions(false);
  };

  const toggleNumBabiesOptions = () => {
    setShowNumBabiesOptions(!showNumBabiesOptions);
  };

  const selectNumBabiesOption = (option) => {
    setNumBabies(''); // Clear any manually entered number of babies
    setSelectedNumBabiesOption(option);
    setShowNumBabiesOptions(false);
  };

  const resetForm = () => {
    setDueDate(null);
    setNumBabies('');
    setBirthPlan('');
    setShowDatePicker(false);
    setShowBirthPlanOptions(false);
    setShowNumBabiesOptions(false);
    setSelectedBirthPlanOption(null);
    setSelectedNumBabiesOption(null);
  };

  const handlePregnancyStatusChange = (status) => {
    setPregnancyStatus(status);
    resetForm();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setShowBirthPlanOptions(false);
      setShowNumBabiesOptions(false);
    });
    return () => {
      keyboardDidShowListener.remove();
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(29,20,21,1)' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: "rgba(241,194,224,0.90)", fontSize: 24, textAlign: "center", marginBottom: 20, textShadowColor: "white", textShadowRadius: 8 }}>Choose Status</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: "center", }}>
                  <TouchableOpacity onPress={() => {
                    handlePregnancyStatusChange('Pregnancy');
                    setShowNumBabiesOptions(false);
                  }} style={{ ...styles.radioButton, borderColor: pregnancyStatus === 'Pregnancy' ? "rgba(251,104,174,1)" : "white", backgroundColor: pregnancyStatus === 'Pregnancy' ? "white" : "lightgrey" }}>
                    <Image source={require("../assets/pregnancy.png")} style={{ height: "100%", width: "57%", resizeMode: "cover" }} />
                  </TouchableOpacity>
                  <Text style={{ color: 'white', marginLeft: 10 }}>Pregnancy</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                  <TouchableOpacity onPress={() => {
                    handlePregnancyStatusChange('MotherHood');
                    setShowNumBabiesOptions(false);
                  }} style={{ ...styles.radioButton, borderColor: pregnancyStatus === 'MotherHood' ? "rgba(251,104,174,1)" : "white", backgroundColor: pregnancyStatus === 'MotherHood' ? "white" : "lightgrey" }}>
                    <Image source={require("../assets/motherhoodOption.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                  </TouchableOpacity>
                  <Text style={{ color: 'white', marginLeft: 10 }}>MotherHood</Text>
                </View>
              </View>
            </View>
            {pregnancyStatus === 'Pregnancy' && (
              <View>
                <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                  <Text style={{ color: 'white' }}>Select Expected Due Date 📅</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dueDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
                {dueDate && (
                  <Text style={{ color: 'rgba(241,194,224,0.90)', marginBottom: 10, textAlign: "center" }}>
                    Selected Due Date: {dueDate.toLocaleDateString()}
                  </Text>
                )}
                <TouchableOpacity onPress={toggleBirthPlanOptions} style={styles.dropdownButton}>
                  <Text style={{ color: 'white' }}>
                    {selectedBirthPlanOption ? selectedBirthPlanOption : 'Select Birth Plan'}
                  </Text>
                </TouchableOpacity>
                {showBirthPlanOptions && birthPlanOptions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => selectBirthPlanOption(item)}
                  >
                    <Text style={{ color: 'white' }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={toggleNumBabiesOptions} style={styles.dropdownButton}>
                  <Text style={{ color: 'white' }}>
                    {selectedNumBabiesOption ? selectedNumBabiesOption.label : 'Number of Babies'}
                  </Text>
                </TouchableOpacity>
                {showNumBabiesOptions && numBabiesOptions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => selectNumBabiesOption(item)}
                  >
                    <Text style={{ color: 'white' }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={{ color: "rgba(241,194,224,0.90)", fontSize: 20, textAlign: "center", marginTop: 10, textShadowColor: "white", textShadowRadius: 8 }}>Emergency Phone Numbers</Text>
            <TextInput
              style={{ ...styles.input, marginBottom: 10 }}
              placeholder="Emergency Phone Number 1"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={emergencyPhone1}
              onChangeText={(text) => setEmergencyPhone1(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <TextInput
              style={{ ...styles.input, marginBottom: 10 }}
              placeholder="Emergency Phone Number 2"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={emergencyPhone2}
              onChangeText={(text) => setEmergencyPhone2(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '500', textShadowRadius: 8, textShadowColor: "rgba(255,255,255,0.6)" }}>Save Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  radioButton: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
    overflow: "hidden"
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10
  },
  dropdownButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    borderRadius: 10
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 5,
    borderRadius: 10
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'rgba(241,194,224,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    marginBottom:25
  },
};

export default ProfileBuild;
