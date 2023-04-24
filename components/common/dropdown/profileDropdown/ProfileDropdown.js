import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons"; // Import the Icon component

const ProfileDropdown = forwardRef(({ handleSettings, handleLogout, handleStatistics }, ref) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownVisible(!isDropdownVisible);
	};

	useImperativeHandle(ref, () => ({
		toggleDropdown,
	}));

	return (
		<View>
			<TouchableOpacity onPress={toggleDropdown}>
				<Image source={require("../../../../assets/images/user.png")} style={styles.profilePicture} />
			</TouchableOpacity>
			<Modal isVisible={isDropdownVisible} onBackdropPress={toggleDropdown} style={styles.modal}>
				<View style={styles.dropdown}>
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
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	modal: {
		margin: 0,
	},
	dropdown: {
		backgroundColor: "white",
		borderRadius: 10,
		paddingHorizontal: 24, // Increase the padding for wider buttons
		paddingVertical: 8,
		position: "absolute",
		right: 16,
		top: 56,
		elevation: 5,
	},
	dropdownItem: {
		flexDirection: "row", // Change the layout to a row
		alignItems: "center", // Align the items to the center
		paddingVertical: 12,
	},
	dropdownItemText: {
		fontSize: 18,
		color: "black",
		marginLeft: 16, // Add some margin between the icon and the text
	},
	logoutText: {
		fontWeight: "bold",
	},
});

export default ProfileDropdown;
