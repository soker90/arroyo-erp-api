//* *********************************************************************
// function waitfor - Wait until a condition is met
//
// Needed parameters:
//    testFunc: function that returns a value
//    expectedValue: the value of the test function we are waiting for
//    msec: delay between the calls to test
//    callback: function to execute when the condition is met
//* *********************************************************************
const waitfor = (testFunc, expectedValue, msec, callback) => {
  // Check if condition met. If not, re-check later (msec).
  while (testFunc() !== expectedValue) {
    setTimeout(() => {
      waitfor(testFunc, expectedValue, msec, callback);
    }, msec);

    return;
  }

  callback();
};

module.exports = waitfor;
