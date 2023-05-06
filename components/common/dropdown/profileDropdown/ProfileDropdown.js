import React, { useState, forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../../../constants";
import Modal from "react-native-modal";
import firebase, { firestore } from "../../../../config/firebase/config";
import Icon from "react-native-vector-icons/Ionicons"; // Import the Icon component

const ProfileDropdown = forwardRef(({ handleSettings, handleLogout, handleStatistics }, ref) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [profileImage, setProfileImage] = useState(require("../../../../assets/images/menu.png"));
	const [name, setName] = useState("");
	const user = firebase.auth().currentUser;
	const usersRef = firebase.firestore().collection("users");

	useEffect(() => {
		if (user) {
			const unsubscribe = usersRef.doc(user.uid).onSnapshot((snapshot) => {
				if (snapshot.exists) {
					setName(snapshot.data().name);
				} else {
					console.log("User does not exist");
				}
			});

			return () => {
				unsubscribe();
			};
		}
	}, []);

	const toggleDropdown = () => {
		setIsDropdownVisible(!isDropdownVisible);
	};

	useImperativeHandle(ref, () => ({
		toggleDropdown,
	}));

	return (
		<View>
			<TouchableOpacity onPress={toggleDropdown}>
				<Image source={require("../../../../assets/images/menu.png")} style={styles.profilePicture} />
			</TouchableOpacity>
			<Modal isVisible={isDropdownVisible} onBackdropPress={toggleDropdown} style={styles.modal}>
				<View style={styles.dropdown}>
					<View style={styles.dropdownItem}>
						<Text style={styles.dropdownProfileName}>{name}</Text>
					</View>
					<TouchableOpacity style={styles.dropdownItem} onPress={handleSettings}>
						<Icon name="settings-outline" size={24} color="black" />
						<Text style={styles.dropdownItemText}>Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.dropdownItem} onPress={handleStatistics}>
						<Icon name="stats-chart-outline" size={24} color="black" />
						<Text style={styles.dropdownItemText}>Statistics</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
						<Icon name="log-out-outline" size={24} color="black" />
						<Text style={[styles.dropdownItemText, styles.logoutText]}>Logout</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
});

const styles = StyleSheet.create({
	profilePicture: {
		width: 30,
		height: 30,
	},
	modal: {
		margin: 0,
	},
	dropdown: {
		backgroundColor: "white",
		borderRadius: 10,
		paddingHorizontal: 24,
		paddingVertical: 8,
		position: "absolute",
		right: 16,
		top: 56,
		elevation: 5,
	},
	dropdownItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
	dropdownProfileName: {
		fontSize: 18,
		color: COLORS.primary,
		fontFamily: FONT.bold,
		marginLeft: 16,
	},
	dropdownItemText: {
		fontSize: 18,
		color: "black",
		marginLeft: 16,
	},
	logoutText: {
		fontWeight: "bold",
	},
});

export default ProfileDropdown;
