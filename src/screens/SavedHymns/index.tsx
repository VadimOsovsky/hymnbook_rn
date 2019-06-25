import React from "react";
import { ActivityIndicator, FlatList, StatusBar, Text, View } from "react-native"
import { Appbar, Searchbar } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { HymnsInterface } from "../../reducers/hymnsReducer";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import SavedHymnElement from "./components/SavedHymnElement";
import HeaderWrapper from "../../shared/HeaderWrapper";
import style from "./style";
import HymnItem from "../../models/HymnItem";

interface ReduxProps {
  hymns: HymnsInterface
}

interface OwnProps {
  navigation: NavigationParams
}

type Props = ReduxProps & OwnProps

interface State {
  isSearchMode: boolean,
  searchQuery: string,
  selectedHymns: number,
}

class SavedHymns extends React.Component<Props, State> {

  private SearchbarRef: Searchbar | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearchMode: false,
      searchQuery: "",
      selectedHymns: 0,
    }
  }

  private openSearch = () => {
    this.setState({isSearchMode: true}, () => {
      this.SearchbarRef && this.SearchbarRef.focus();
    });
  };

  private closeSearch = () => this.setState({isSearchMode: false});

  private filterSavedHymns = () => {
    if (this.state.searchQuery) {
      return this.props.hymns.savedHymns.filter((hymn: HymnItem) => {
        return hymn.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      })
    } else {
      return this.props.hymns.savedHymns
    }
  };

  private renderHeader() {
    if (this.state.isSearchMode) {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Searchbar
              icon="arrow-back"
              placeholder="Search"
              ref={(ref: Searchbar) => this.SearchbarRef = ref}
              onIconPress={this.closeSearch}
              onChangeText={query => this.setState({searchQuery: query})}
              value={this.state.searchQuery}
            />
          </Appbar.Header>
        </HeaderWrapper>
      )
    } else {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            {/*<Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>*/}
            <Appbar.Content title="My Saved Hymns"/>
            <Appbar.Action icon="search" onPress={this.openSearch}/>
          </Appbar.Header>
        </HeaderWrapper>
      )
    }
  }

  private renderSearchQuery = () => {
    return (
      <Text style={[style.searchQuery, {display: this.state.searchQuery ? "flex" : "none"}]}>
        Results found for: {this.state.searchQuery}
      </Text>
    )
  };

  private renderSavedHymns = () => {
    if (this.props.hymns.isSavedHymnsLoading) {
      return (
        <ActivityIndicator size="large" style={style.noHymns}/>
      )
    } else if (!this.filterSavedHymns().length) {
      return (
        <Text style={style.noHymns}>Empty here</Text>
      )
    } else {
      return (
        <FlatList
          data={this.filterSavedHymns()}
          keyExtractor={(item => String(item.hymnId))}
          renderItem={({item}) => <SavedHymnElement navigation={this.props.navigation} savedHymn={item}/>}
        />
      )
    }
  };

  private renderFAB = () => {
    if (!this.props.hymns.isSavedHymnsLoading) {
      return <SavedHymnsFAB navigation={this.props.navigation}/>
    }
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        {this.renderHeader()}
        {this.renderSearchQuery()}
        {this.renderSavedHymns()}
        {this.renderFAB()}
      </View>
    );
  }

}

// @ts-ignore
const mapStateToProps = (state) => {
  const {hymns} = state;
  return {hymns}
};

export default connect(mapStateToProps)(SavedHymns);
