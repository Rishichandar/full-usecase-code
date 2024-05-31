import { endTimer, incrementTimer, startTimer } from "./TimerSlice";

export const manageTimer = () => (dispatch, getState) => {
  // Start the timer
  dispatch(startTimer());
  const interval = setInterval(() => {
    // Check if the timer should still be running
    const { timerActive } = getState().timerState;
    if (!timerActive) {
      // If timerActive is false, clear the interval to stop repeating the timer updates
      clearInterval(interval);
    } else {
      // If timerActive is true, dispatch the incrementTimer action to increase the timer count
      dispatch(incrementTimer(interval));
      console.log("interval", interval);
    }
  }, 1000);

  // Provide a way to stop the timer
  // return () => {
  //   clearInterval(interval);
  // };
};
