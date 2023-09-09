import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ColorAssets } from "../../utils/app-assets";
import {
  CustomTextInput,
  CustomTextInput2,
} from "../../common/custom/custom-textInput";
import { ScrollView } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import SharedPreferences from "../../database/share_preferences_helper";
import { useEffect } from "react";
import {
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeScreenWithOutTime, navigateWithoutClearingStack } from "../../utils/navigation-utils";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
const AddHotelScreen = ({ navigation }) => {
  const phoneInput = React.useRef(null);
  const hotelData = useSelector((state) => state.addHotel.hotel);
  const dispatch = useDispatch();
  const handleInputChange = (fieldName, value) => {
    dispatch({ type: "UPDATE_HOTEL_FIELD", payload: { fieldName, value } });
  };
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient permission!",
        "You need to grant camera access to use this app"
      );
      return false;
    }
    return true;
  }

  async function camerapressHandler(selectedKey) {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    const image = await launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: false,
      aspect: [9, 16],
      quality: 1,
    });

    if (!image.canceled) {
      const updatedData = hotelData.image.map((item) => {
        if (item.key === selectedKey) {
          console.log("equals key " + item.key);
          return { ...item, uri: image.assets[0].uri };
        }
        return item;
      });
      dispatch({
        type: "UPDATE_IMAGE_DATA",
        payload: updatedData,
      });
    }
  }
  const getUserInfor = () => {
    SharedPreferences.GET_USER_INFOR()
      .then((userInfoString) => {
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          handleInputChange("id_owner", userInfo.id);
        } else {
          console.log("User information not found.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving user information:", error);
      });
  };
  useEffect(() => {
    getUserInfor();
  }, []);

  const phoneNumberWithoutCountryCode =
    hotelData?.hotline.replace("+84", "") || hotelData.hotline;

  const addHotel = async () => {
    const selectedImageCount = hotelData.image.filter(
      (item) => item.uri !== " "
    ).length;
    if (selectedImageCount < 6) {
      Alert.alert(
        "Incomplete Images",
        "Please select at least 6 images before adding the hotel."
      );
      return;
    }

    dispatch({
      type: "ADD_HOTEL",
      payload: {
        ...hotelData,
        name: hotelData.name,
        address: hotelData.address,
        id_owner: hotelData.id_owner,
        description: hotelData.description,
        open_time: hotelData.open_time,
        close_time: hotelData.close_time,
        hotline: hotelData.hotline,
        place: hotelData.place,
        image: hotelData.image,
      },
    });
    navigation.navigate("TypeOfRoom")
    // navigateWithoutClearingStack(navigation, "TypeOfRoom");
  };

  return (
    <View style={{ backgroundColor: ColorAssets.whiteColor }}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.boxModal}>
            <View style={styles.topModal}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleModal}>Add Hotel</Text>
              </View>
              <View style={styles.hrModal}></View>
              <Text style={styles.text1Modal}>Media</Text>
              <View
                style={{
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <View style={styles.viewMedia}>
                  {hotelData.image.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          camerapressHandler(item.key);
                        }}
                      >
                        <View style={styles.item} key={item.key}>
                          <Image
                            source={{ uri: item.uri }}
                            style={styles.imageStyle}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={styles.bodyModal}>
              <CustomTextInput
                title="Name"
                valueText={hotelData.name}
                placeholder={hotelData?.name || "Hotel Name"}
                isHaveTitle={true}
                onChangeText={(e) => handleInputChange("name", e)}
              />
              <CustomTextInput
                title="Address"
                placeholder={hotelData?.address || "Hotel Address"}
                isHaveTitle={true}
                valueText={hotelData.address}
                onChangeText={(e) => handleInputChange("address", e)}
              />
              <CustomTextInput
                title="Description"
                isHaveTitle={true}
                valueText={hotelData.description}
                placeholder={hotelData?.description || "Hotel Description"}
                onChangeText={(e) => handleInputChange("description", e)}
              />
              <View style={styles.rowTime}>
                <CustomTextInput2
                  valueText={hotelData?.open_time}
                  textPlaceHolder={hotelData?.open_time || "Open Time"}
                  onChangeText={(e) => handleInputChange("open_time", e)}
                />
                <CustomTextInput2
                  valueText={hotelData?.close_time}
                  textPlaceHolder={hotelData?.close_time || "Close Time"}
                  onChangeText={(e) => handleInputChange("close_time", e)}
                />
              </View>
              <Text style={styles.text1Modal}>Hotline</Text>
              <PhoneInput
                ref={phoneInput}
                disableArrowIcon={true}
                defaultValue={phoneNumberWithoutCountryCode}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.textInput}
                onChangeFormattedText={(e) => handleInputChange("hotline", e)}
                defaultCode="VN"
                layout="first"
              />
              <CustomTextInput
                title={"Place"}
                valueText={hotelData.place}
                placeholder={hotelData?.place || "Place"}
                isHaveTitle={true}
                onChangeText={(e) => handleInputChange("place", e)}
              />
            </View>
            <View style={styles.bottomModal}>
              <TouchableOpacity
                style={styles.btnContinueModal}
                onPress={addHotel}
              >
                <Text style={styles.textContinueModal}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCancelModal}
                onPress={() => navigation.pop()}
              >
                <Text style={styles.textCancelModal}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AddHotelScreen;
