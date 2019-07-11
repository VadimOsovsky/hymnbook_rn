import React from "react";
import { StatusBar, ToastAndroid } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { createAppContainer } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { getSavedHymnsFromStorage } from "../actions/hymnActions";
import { getUserPrefsFromStorage } from "../actions/preferencesActions";
import Action from "../models/Action";
import rootStack from "../navigation/rootStack";
import { AppState } from "../reducers";

const Navigation = createAppContainer(rootStack);

interface ReduxDispatch {
  getHymns: () => void;
  getUserPrefsFromStorage: () => void;
}

interface OwnProps {
}

interface State {
  isAppReady: boolean;
}

type Props = AppState & ReduxDispatch & OwnProps;

class RootScreen extends React.Component<Props, State> {

  public readonly state = {
    isAppReady: false,
  };

  public async componentDidMount() {
    this.props.getHymns();
    this.props.getUserPrefsFromStorage();
    this.hideSplashScreen(this.props);
  }

  public componentWillReceiveProps(nextProps: Readonly<AppState & ReduxDispatch & OwnProps & State>, nextContext: any) {
    this.hideSplashScreen(nextProps);
  }

  private hideSplashScreen = (props: Props) => {
    const {isLaunchingApp, isSavedHymnsLoading, error} = props.hymns!;
    const {isPrefsReady} = props.prefs!;
    if (!isLaunchingApp && !isSavedHymnsLoading && isPrefsReady) {
      SplashScreen.hide();
      if (error) { ToastAndroid.show(error, ToastAndroid.LONG); }
      this.setState({isAppReady: true});
    }
  }

  public render() {
    return (
      <PaperProvider theme={this.props.prefs!.userPrefs.theme}>
        <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0.15)"/>
        <Navigation/>
      </PaperProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs} = state;
  return {hymns, prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    getHymns: () => dispatch(getSavedHymnsFromStorage()),
    getUserPrefsFromStorage: () => dispatch(getUserPrefsFromStorage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
