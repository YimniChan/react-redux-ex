// Imports
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  depositFiftyActionCreator,
  depositHundredActionCreator,
  depositCustomAmountActionCreator,
  withdrawFiftyActionCreator,
  withdrawHundredActionCreator,
  withdrawCustomAmountActionCreator,
  convertCurrencyThunkCreator,
} from '../store/reducers/bankReducer';

// Component
class Atm extends Component {
  constructor() {
    super();
    this.state = {
      sourceCurrency: '$',
      targetCurrency: '€',
      customAmount: 0,
      invalidCustomAmount: false,
      disabledCustomAmount: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleConvert = this.handleConvert.bind(this);
  }

  handleChange(event) {
    const curCustomAmount = event.target.value;

    if (!curCustomAmount.length) {
      this.setState({
        invalidCustomAmount: false,
        disabledCustomAmount: true,
      });
    } else if (isNaN(Number(curCustomAmount))) {
      this.setState({
        invalidCustomAmount: true,
        disabledCustomAmount: true,
      });
    } else {
      this.setState({
        customAmount: Number(curCustomAmount),
        invalidCustomAmount: false,
        disabledCustomAmount: false,
      });
    }
  }

  handleConvert() {
    console.log('Convert Currency');
    if (this.state.sourceCurrency === '$') {
      // Don't forget to plug in your Thunk after you map your Thunk Creator to props.
      this.props.convertCurrencyThunk('USD', 'EUR');
    } else {
      // Remember, currency conversion can go both ways.
      this.props.convertCurrencyThunk('EUR', 'USD');
    }

    // Make sure you swap the sourceCurrency and targetCurrency every time you convert.
    this.setState(prevState => {
      console.log({ prevState });
      return {
        ...prevState,
        sourceCurrency: prevState.targetCurrency,
        targetCurrency: prevState.sourceCurrency,
      };
    });
  }

  render() {
    return (
      <div className="atm">
        <div className="terminal">
          {/*
            What is wrong with the way we are bringing in the balance after converting it?
            Look into the toFixed method:
            (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)
            */}
          <h1 className="balance">
            {this.state.sourceCurrency} {this.props.balance.toFixed(2)}
            </h1>

          <button type="button" onClick={this.handleConvert}>
            <span>Convert to </span>
            <span className="text-style-bold">{this.state.targetCurrency}</span>
          </button>
        </div>

        <div className="terminal">
          <button type="button" onClick={() => this.props.depositFiftyAction()}>
            Deposit {this.state.sourceCurrency} 50
          </button>

          <button
            type="button"
            onClick={() => this.props.withdrawFiftyAction()}
          >
            Withdraw {this.state.sourceCurrency} 50
          </button>

          <button
            type="button"
            onClick={() => this.props.depositHundredAction()}
          >
            Deposit {this.state.sourceCurrency} 100
          </button>

          <button
            type="button"
            onClick={() => this.props.withdrawHundredAction()}
          >
            Withdraw {this.state.sourceCurrency} 100
          </button>
        </div>

        <div className="terminal">
          <div className="custom-amount-container">
            <input
              className="custom-amount-containee"
              type="text"
              placeholder="Enter Custom Amount"
              required
              onChange={event => this.handleChange(event)}
            />
          </div>

          <button
            type="button"
            disabled={this.state.disabledCustomAmount}
            onClick={() =>
              this.props.depositCustomAmountAction(this.state.customAmount)
            }
          >
            Deposit {this.state.sourceCurrency}
          </button>

          <button
            type="button"
            disabled={this.state.disabledCustomAmount}
            onClick={() =>
              this.props.withdrawCustomAmountAction(this.state.customAmount)
            }
          >
            Withdraw {this.state.sourceCurrency}
          </button>
        </div>
        {this.state.invalidCustomAmount ? (
          <div className="terminal">
            Invalid Custom Amount! Please Try Again.
          </div>
        ) : null}
      </div>
    );
  }
}

// Container
const mapStateToProps = state => {
  console.log('state in mapStateToProps: ', state);

  return {
    balance: state.bank.balance,
  };
};

const mapDispatchToProps = dispatch => {
  console.log('dispatch in mapDispatchToProps: ', dispatch);

  return {
    depositFiftyAction() {
      dispatch(depositFiftyActionCreator());
    },
    depositHundredAction() {
      dispatch(depositHundredActionCreator());
    },
    depositCustomAmountAction(customAmount) {
      dispatch(depositCustomAmountActionCreator(customAmount));
    },
    withdrawFiftyAction() {
      dispatch(withdrawFiftyActionCreator());
    },
    withdrawHundredAction() {
      dispatch(withdrawHundredActionCreator());
    },
    withdrawCustomAmountAction(customAmount) {
      dispatch(withdrawCustomAmountActionCreator(customAmount));
    },
    // Make sure you import your newly made Thunk Creator and plug it into mapDispatchToProps properly.
    convertCurrencyThunk(sourceCurrency,targetCurrency) {
      dispatch(convertCurrencyThunkCreator(sourceCurrency, targetCurrency));
    },
  };
};
// Please refactor mapStateToProps and mapDispatchToProps into implicitly returning functions rather than explicitly returning ones once you get everything up and running

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Atm);