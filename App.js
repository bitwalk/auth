import React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
	Button,
} from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class AuthLoadingScreen extends React.Component {
	componentDidMount() {
		this._bootstrapAsync();
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken');

		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.
		this.props.navigation.navigate(userToken ? 'App' : 'Auth');
	};

	// Render any loading content that you like here
	render() {
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: 'Please sign in',
	};

	render() {
		return (
			<View>
				<Button title="Sign in!" onPress={this._signInAsync} />
			</View>
		);
	}

	_signInAsync = async () => {
		await AsyncStorage.setItem('userToken', 'abc');
		this.props.navigation.navigate('App', { username: 'bitwalk' });
	};
}

class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Welcome to the app!',
	};

	componentDidMount() {
		const { navigation } = this.props;
		const myNavigationParam = navigation.getParam('username', 'error');
		console.log(myNavigationParam);
	}

	render() {
		return (
			<View>
				<Button title="Show me more of the app" onPress={this._showMoreApp} />
				<Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
			</View>
		);
	}

	_showMoreApp = () => {
		console.log(this.props.navigation.getParam('username'));
		console.log(this.props.navigation.state.params);
		this.props.navigation.navigate('Other');
	};

	_signOutAsync = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
}

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: AppStack,
			Auth: AuthStack,
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);

