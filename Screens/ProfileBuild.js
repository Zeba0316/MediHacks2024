import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Platform, Alert } from 'react-native';
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
    if (pregnancyStatus === 'Pregnant') {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(29,20,21,1)' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', marginBottom: 10 }}>Are you pregnant?</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
              handlePregnancyStatusChange('Pregnant');
              setShowNumBabiesOptions(true); // Show number of babies options when selecting Pregnant
            }} style={styles.radioButton}>
              {pregnancyStatus === 'Pregnant' && <View style={styles.radioInnerCircle} />}
            </TouchableOpacity>
            <Text style={{ color: 'white', marginLeft: 10 }}>Pregnant</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={() => {
              handlePregnancyStatusChange('Not Pregnant');
              setShowNumBabiesOptions(false); // Hide number of babies options when selecting Not Pregnant
            }} style={styles.radioButton}>
              {pregnancyStatus === 'Not Pregnant' && <View style={styles.radioInnerCircle} />}
            </TouchableOpacity>
            <Text style={{ color: 'white', marginLeft: 10 }}>Not Pregnant</Text>
          </View>
        </View>

        {pregnancyStatus === 'Pregnant' && (
          <View>
            <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
              <Text style={{ color: 'white' }}>Select Expected Due Date</Text>
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
              <Text style={{ color: 'white', marginTop: 10 }}>
                Selected Due Date: {dueDate.toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity onPress={toggleBirthPlanOptions} style={styles.dropdownButton}>
              <Text style={{ color: 'white' }}>
                {selectedBirthPlanOption ? selectedBirthPlanOption : 'Select Birth Plan'}
              </Text>
            </TouchableOpacity>
            {showBirthPlanOptions && (
              <FlatList
                data={birthPlanOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectBirthPlanOption(item)}
                  >
                    <Text style={{ color: 'white' }}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 10 }}
              />
            )}
            <TouchableOpacity onPress={toggleNumBabiesOptions} style={styles.dropdownButton}>
              <Text style={{ color: 'white' }}>
                {selectedNumBabiesOption ? selectedNumBabiesOption.label : 'Number of Babies'}
              </Text>
            </TouchableOpacity>
            {showNumBabiesOptions && (
              <FlatList
                data={numBabiesOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectNumBabiesOption(item)}
                  >
                    <Text style={{ color: 'white' }}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        )}

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
          <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 18, fontWeight: '500' }}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
  },
};

export default ProfileBuild;
