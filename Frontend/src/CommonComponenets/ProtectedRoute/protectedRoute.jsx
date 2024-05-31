
import React, { useEffect } from 'react'
import { CheckToken, getActivities } from '../../HTTPHandler/api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authenticate, logout } from '../../Redux/authSlice/AuthSlice';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../../Component/usermenu';
import { setCurrentTimer } from "../../Redux/timerSlice/TimerSlice";
import { manageTimer } from "../../Redux/timerSlice/ManageTimer";
import { setBreak, setLunch } from '../../Redux/ctrlMngntSilce/breakManagementSlice';

export const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isTimerActive=useSelector((state)=>state.timerState.timerActive);

    useEffect(() => {
        CheckToken()
          .then(async (res) => {
            if (res.Status === "Success") {
              dispatch(authenticate({ user: res.Response }));
              await getActivities(res.Response.Email, ["Time In", "Time Out","breakin","breakout","lunchin","lunchout"]).then(
                (res) => {
                  if (res.Status === "Success") {
                    if(!isTimerActive)
                    SetInitialTimer(res.Response);
                  }
                }
              );
            } else {
              dispatch(logout());
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.message);
            navigate("/");
          });
      }, []);

      function SetInitialTimer(activities) {
        const result = [];
        let lastCheckInTime = null;
        const currentTime = new Date();
    
        activities.forEach((activity) => {
          const [hours, minutes, seconds] = activity.Time.split(":").map(Number);
          const activityTime = new Date();
          activityTime.setHours(hours, minutes, seconds, 0); // Set the time based on the HH:MM:SS format
    
          console.log(activityTime);
    
          if (activity.Activity_type === "Time In") {
            lastCheckInTime = activityTime;
          } else if (activity.Activity_type === "Time Out" && lastCheckInTime) {
            const timeDifference = Math.round(
              (activityTime - lastCheckInTime) / 1000
            ); // Difference in seconds
            result.push({
              checkIn: lastCheckInTime,
              checkOut: activityTime,
              isBreakIn:null,
              isLunchIn:null,
              durationInSeconds: timeDifference,
            });
            lastCheckInTime = null; // Reset after pairing check in and check out
          }
        });
    
        // Handle the case where there is a check in but no check out
        if (lastCheckInTime) {
          const timeDifference = Math.round((currentTime - lastCheckInTime) / 1000); // Difference in seconds
          result.push({
            checkIn: lastCheckInTime,
            checkOut: null,
            isBreakIn:null,
            isLunchIn:null,
            durationInSeconds: timeDifference,
          });
        }
        let breakIn =activities?.filter(x=>x.Activity_type === "breakin");
        let breakOut = activities?.filter(x=>x.Activity_type === "breakout");
        let lunchIn = activities?.filter(x=>x.Activity_type === "lunchin");
        let lunchOut = activities?.filter(x=>x.Activity_type === "lunchout");

        console.log(result);
        let totalDuration = 0;
        if (result.length > 0) {
          result[result.length-1].isBreakIn = ((breakIn?.length - breakOut.length)%2 !== 0);
          result[result.length-1].isLunchIn = ((lunchIn?.length - lunchOut.length)%2 !== 0);

          result.forEach((x) => {
            totalDuration += x?.durationInSeconds;
            // return totalDuration;
          });
          dispatch(setCurrentTimer(totalDuration));
          // console.log(result[result.lastIndexO]);
          if (!result[result.length - 1]?.checkOut) dispatch(manageTimer());
          dispatch(setLunch(result[result.length-1].isLunchIn))
          dispatch(setBreak(result[result.length-1].isBreakIn))
        }
        // return result;
      }
    
  return <><UserMenu/></>
}
