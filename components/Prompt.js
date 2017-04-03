import React, { Component } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
    alignItems: 'center',
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dialogContent: {
    elevation: 5,
    marginTop: 150,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dialogTitle: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dialogBody: {
    paddingHorizontal: 10,
  },
  dialogInput: {
    height: 50,
    fontSize: 18,
  },
  dialogFooter: {
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  dialogAction: {
    flex: 1,
    padding: 15,
  },
  dialogActionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#006dbf',
  },
});

export default class Prompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      visible: false,
    };
  }

  componentDidMount() {
    this.setState({ value: this.props.defaultValue });
  }

  componentWillReceiveProps(nextProps) {
    const { visible, defaultValue } = nextProps;
    this.setState({ visible, value: defaultValue });
  }

  _onChangeText(value) {
    this.setState({ value });

    if (this.props.onChangeText) {
      this.props.onChangeText(value);
    }
  }

  _onSubmitPress() {
    const { value } = this.state;
    this.props.onSubmit(value);
  }

  _onCancelPress() {
    this.props.onCancel();
  }

  _onDeletePress() {
    this.props.onDelete();
  }

  close() {
    this.setState({ visible: false });
  }

  _renderDialog() {
    const {
      title,
      placeholder,
      defaultValue,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      deleteButtonStyle,
      deleteButtonTextStyle,
      inputStyle,
    } = this.props;

    return (
      <View style={styles.dialog} key="prompt">
        <View style={styles.dialogOverlay}/>
        <View style={[styles.dialogContent, { borderColor }, promptStyle]}>
          <View style={[styles.dialogTitle, { borderColor }]}>
            <Text style={[styles.dialogTitleText, titleStyle]}>
              { title }
            </Text>
            <TouchableWithoutFeedback onPress={this._onCancelPress.bind(this)}>
              <View style={[styles.dialogAction, buttonStyle, cancelButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, cancelButtonTextStyle]}>
                  X
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.dialogBody}>
            <TextInput
              style={[styles.dialogInput, inputStyle]}
              defaultValue={defaultValue}
              onChangeText={this._onChangeText.bind(this)}
              placeholder={placeholder}
              autoFocus={true}
              underlineColorAndroid="white"
              {...this.props.textInputProps} />
          </View>
          <View style={[styles.dialogFooter, { borderColor }]}>
            <TouchableWithoutFeedback onPress={this._onDeletePress.bind(this)}>
              <View style={[styles.dialogAction, buttonStyle, deleteButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, deleteButtonTextStyle]}>
                  Delete
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this._onSubmitPress.bind(this)}>
              <View style={[styles.dialogAction, buttonStyle, submitButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, submitButtonTextStyle]}>
                  OK
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Modal onRequestClose={() => this.close()} transparent={true} visible={this.props.visible}>
        {this._renderDialog()}
      </Modal>
    );
  }
}
